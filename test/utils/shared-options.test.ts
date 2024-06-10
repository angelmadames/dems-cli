import { describe, expect, test } from 'bun:test'
import { sharedOptions } from '../../src/utils/shared-options'

describe('Utils: sharedOptions', () => {
  test('info() returns an Option object with the correct properties', () => {
    const option = sharedOptions.info
    expect(option).toHaveProperty('flags', '-i, --info')
    expect(option).toHaveProperty('defaultValue', false)
  })

  test('gitRef() returns an Option object with the correct properties', () => {
    const option = sharedOptions.gitRef
    expect(option).toHaveProperty('flags', '-g, --git-ref [ref]')
    expect(option).toHaveProperty('defaultValue', undefined)
  })

  test('reposRoot() returns an Option object with the correct properties', () => {
    const option = sharedOptions.reposRoot
    expect(option).toHaveProperty('flags', '-o, --repos-root [path]')
    expect(option).toHaveProperty('defaultValue', undefined)
  })

  test('gitOrg() returns an Option object with the correct properties', () => {
    const option = sharedOptions.gitOrg
    expect(option).toHaveProperty('flags', '-z, --git-org [git-org]')
    expect(option).toHaveProperty('defaultValue', undefined)
  })

  test('repos() returns an Option object with the correct properties', () => {
    const option = sharedOptions.repos
    expect(option).toHaveProperty('flags', '-r, --repos [repos]')
    expect(option).toHaveProperty('defaultValue', undefined)
  })

  test('force() returns an Option object with the correct properties', () => {
    const option = sharedOptions.force
    expect(option).toHaveProperty('flags', '-f, --force')
    expect(option).toHaveProperty('defaultValue', false)
  })
})
