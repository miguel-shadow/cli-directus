/* eslint-disable @stylistic/function-paren-newline */

/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import chalk from 'chalk'
import inquirer from 'inquirer'
import { OutputTools, TimeTools } from '@tools'
import { RESOURCES, resourcesTools, type Resource } from './resources.js'

import type { DeployRetrieveCommandOptions, DeployRetrieveResourceActionOptions, DeployRetrieveResourceActionSet } from '@commands'


export const dispatcherTools = {
  collectDeployRetrieveResource,
  runDeployRetrieveResources,
}


function collectDeployRetrieveResource(value: string, previous: string[] = []): string[] {
  return [...previous, value]
}


async function runDeployRetrieveResources(
  config: DeployRetrieveCommandOptions,
  options: DeployRetrieveResourceActionOptions,
  resourceActions: DeployRetrieveResourceActionSet,
): Promise<void> {
  const resources = buildDeployRetrieveSelection(options.resource)
  const isAllResources = resources.length === RESOURCES.length
  const resourceLabel = isAllResources ? 'All' : resources.join(', ')
  const confirmationLabel = isAllResources ?
    'todos los recursos' :
    `los siguientes recursos: ${resources.join(', ')}`
  const titleMessage = `Directus CLI (${chalk.blue(chalk.underline(config.directusApi.directusEnvData.url))}) - ${resourceActions.title} ${resourceLabel}`

  console.log(OutputTools.formatTitle(titleMessage))
  console.log()

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: `¿${resourceActions.confirmVerb} ${confirmationLabel}?`,
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
    console.log()
  }

  const actionOptions = { ...options, skipConfirm: true }

  for (const [index, resource] of resources.entries()) {
    console.log(OutputTools.formatSubtitle(`Retrieve ${resource}`))
    console.log()
    await resourceActions.actions[resource](config, actionOptions)
    console.log()
    console.log(OutputTools.formatSubtitle('Operación completada', { divisorColor: chalk.blue, textColor: chalk.blue }))

    console.log()
    if (index < resources.length - 1) {
      console.log()
      await TimeTools.sleep(1234)
    }
  }
  console.log(OutputTools.formatTitle(titleMessage, { divisorColor: chalk.blueBright, textColor: chalk.green }))
}


function buildDeployRetrieveSelection(resources: string[] | undefined): Resource[] {
  const selection = resources && resources.length > 0 ? resources : [ ...RESOURCES ]
  const invalidResources: string[] = []

  for (const resource of selection) {
    if (!resourcesTools.isResource(resource)) {
      invalidResources.push(resource)
    }
  }

  if (invalidResources.length > 0) {
    const plural = invalidResources.length > 1
    throw new Error(`Recurso${plural ? 's' : ''} no válido${plural ? 's' : ''}: '${invalidResources.join(', ')}'.\n\nRecursos válidos: ${RESOURCES.join(', ')}`)
  }

  const selectedResources = new Set(selection)
  return RESOURCES.filter((resource) => selectedResources.has(resource))
}
