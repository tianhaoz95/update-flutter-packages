import { PubApiModel } from "../model/pubApiModel"
import { Scalar, Pair } from "yaml/types"
import axios from "axios"
import semverDiff from "semver-diff"

/**
 * Returns the Latest version that the package can 
 * automatically update to following semver.
 */
async function getLatestPackage(dependency: Pair): Promise<PubApiModel.Version | undefined> {
    const dependencyKey: Scalar = dependency.key
    const dependencyValue: Scalar = dependency.value

    let dependencyName = dependencyKey.value
    let dependencyVersion = dependencyValue.value?.replace('^', '') ?? undefined

    const packageEndpoint = `https://pub.dev/api/packages/${dependencyName}`

    const response = await axios.get(packageEndpoint)
    const responseData: PubApiModel.RootObject = response.data
    let versions = responseData.versions
    let latestVersion: PubApiModel.Version | undefined = undefined
    versions.reverse().every((element, index) => {
        let diff = semverDiff(dependencyVersion, element.version)
        if (diff == 'patch') {
            latestVersion = element
            return false
        }
        return true
    })
    return latestVersion
}

export {
    getLatestPackage
}