import {
    Action,
    ActivepiecesError,
    apId,
    ErrorCode,
    File,
    FileCompression,
    FileType,
    flowHelper,
    FlowId,
    FlowVersion,
    FlowVersionId,
    isNil,
    ProjectId,
    StepRunResponse,
    Trigger,
} from '@activepieces/shared'
import { engineRunner } from 'server-worker'
import { accessTokenManager } from '../../authentication/lib/access-token-manager'
import { fileRepo, fileService } from '../../file/file.service'
import { flowVersionService } from '../flow-version/flow-version.service'

export const sampleDataService = {
    async runAction({
        projectId,
        flowVersionId,
        stepName,
    }: RunActionParams): Promise<Omit<StepRunResponse, 'id'>> {
        const flowVersion = await flowVersionService.getOneOrThrow(flowVersionId)
        const step = flowHelper.getStep(flowVersion, stepName)

        if (isNil(step) || !flowHelper.isAction(step.type)) {
            throw new ActivepiecesError({
                code: ErrorCode.STEP_NOT_FOUND,
                params: {
                    stepName,
                },
            })
        }
        const engineToken = await accessTokenManager.generateEngineToken({
            projectId,
        })

        const { result, standardError, standardOutput } =
            await engineRunner.executeAction(engineToken, {
                stepName,
                flowVersion,
                projectId,
                sampleData: await sampleDataService.getSampleDataForFlow(projectId, flowVersion),
            })

        return {
            success: result.success,
            output: result.output,
            standardError,
            standardOutput,
        }
    },
    async save({
        projectId,
        flowVersionId,
        stepName,
        payload,
    }: SaveSampleDataParams): Promise<File> {
        const flowVersion = await flowVersionService.getOneOrThrow(flowVersionId)
        const step = flowHelper.getStep(flowVersion, stepName)

        if (isNil(step)) {
            throw new ActivepiecesError({
                code: ErrorCode.STEP_NOT_FOUND,
                params: {
                    stepName,
                },
            })
        }
        const fileId = await useExistingOrCreateNewSampleId(projectId, flowVersion, step)
        return fileService.save({
            projectId,
            fileId,
            data: Buffer.from(JSON.stringify(payload)),
            type: FileType.SAMPLE_DATA,
            compression: FileCompression.NONE,
            metadata: {
                flowId: flowVersion.flowId,
                flowVersionId,
                stepName,
            },
        })
    },
    async getOrReturnEmpty(params: GetSampleDataParams): Promise<unknown> {
        const step = flowHelper.getStep(params.flowVersion, params.stepName)
        if (isNil(step)) {
            throw new ActivepiecesError({
                code: ErrorCode.STEP_NOT_FOUND,
                params: {
                    stepName: params.stepName,
                },
            })
        }

        const sampleDataFileId = step.settings.inputUiInfo?.sampleDataFileId
        const currentSelectedData = step.settings.inputUiInfo?.currentSelectedData

        if (isNil(currentSelectedData) && isNil(sampleDataFileId)) {
            return {}
        }
        if (!isNil(sampleDataFileId)) {
            const { data } = await fileService.getDataOrThrow({
                projectId: params.projectId,
                fileId: sampleDataFileId,
                type: FileType.SAMPLE_DATA,
            })
            return JSON.parse(data.toString('utf-8'))
        }
        return currentSelectedData

    },
    async deleteForStep(params: DeleteSampleDataForStepParams): Promise<void> {
        await fileRepo().createQueryBuilder().delete().where({
            id: params.sampleDataFileId,
            projectId: params.projectId,
            type: FileType.SAMPLE_DATA,
        }).andWhere('metadata->>\'flowVersionId\' = :flowVersionId', { flowVersionId: params.flowVersionId }).execute()
    },
    async deleteForFlow(params: DeleteSampleDataParams): Promise<void> {
        await fileRepo().createQueryBuilder().delete().where({
            projectId: params.projectId,
            type: FileType.SAMPLE_DATA,
        }).andWhere('metadata->>\'flowId\' = :flowId', { flowId: params.flowId }).execute()
    },
    async getSampleDataForFlow(projectId: ProjectId, flowVersion: FlowVersion): Promise<Record<string, unknown>> {
        const steps = flowHelper.getAllSteps(flowVersion.trigger)
        const sampleDataPromises = steps.map(async (step) => {
            const data = await sampleDataService.getOrReturnEmpty({
                projectId,
                flowVersion,
                stepName: step.name,
            })
            return { [step.name]: data }
        })
        const sampleDataArray = await Promise.all(sampleDataPromises)
        return Object.assign({}, ...sampleDataArray)
    },
}

async function useExistingOrCreateNewSampleId(projectId: ProjectId, flowVersion: FlowVersion, step: Action | Trigger): Promise<string> {
    const sampleDataId = step.settings.inputUiInfo?.sampleDataFileId
    if (isNil(sampleDataId)) {
        return apId()
    }
    const file = await fileService.getFileOrThrow({
        projectId,
        fileId: sampleDataId,
        type: FileType.SAMPLE_DATA,
    })
    const isNewVersion = file.metadata?.flowVersionId !== flowVersion.id
    if (isNewVersion) {
        return apId()
    }
    return file.id
}


type DeleteSampleDataForStepParams = {
    projectId: ProjectId
    sampleDataFileId: string
    flowVersionId: FlowVersionId
    flowId: FlowId
}

type DeleteSampleDataParams = {
    projectId: ProjectId
    flowId: FlowId
}

type GetSampleDataParams = {
    projectId: ProjectId
    stepName: string
    flowVersion: FlowVersion
}

type SaveSampleDataParams = {
    projectId: ProjectId
    flowVersionId: FlowVersionId
    stepName: string
    payload: unknown
}
type RunActionParams = {
    projectId: ProjectId
    flowVersionId: FlowVersionId
    stepName: string
}
