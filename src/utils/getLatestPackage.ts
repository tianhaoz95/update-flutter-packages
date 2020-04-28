import { PubApiModel } from "../model/pubApiModel"
import { Scalar, Pair } from "yaml/types"
import axios from "axios"

/**
 * Returns the Latest version that the package can 
 * automatically update to following semver.
 * //TODO actually do that.
 */
async function getLatestPackage(dependency: Pair): Promise<PubApiModel.Version> {
    const dependencyKey: Scalar = dependency.key
    const dependencyValue: Scalar = dependency.value

    let dependencyName = dependencyKey.value
    let dependencyVersion = dependencyValue.value?.replace('^', '') ?? undefined

    const packageEndpoint = `https://pub.dev/api/packages/${dependencyName}`

    const response = await axios.get(packageEndpoint)
    const responseData: PubApiModel.RootObject = response.data
    let versions = responseData.versions
    let latestVersion = versions[versions.length - 1]
    return latestVersion
}

export {
    getLatestPackage
}