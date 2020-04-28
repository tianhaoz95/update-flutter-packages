export declare module PubApiModel {

    export interface Environment {
        sdk: string;
    }

    export interface Flutter {
        sdk: string;
    }

    export interface Dependencies {
        font_awesome_flutter: string;
        http: string;
        freezed_annotation: string;
        json_annotation: string;
        flutter: Flutter;
        meta: string;
        shared_preferences: string;
        shared_preferences_macos: string;
    }

    export interface FlutterTest {
        sdk: string;
    }

    export interface DevDependencies {
        freezed: string;
        json_serializable: string;
        build_runner: string;
        flutter_test: FlutterTest;
        pedantic: string;
    }

    export interface DependencyOverrides {
        pedantic: string;
    }

    export interface Pubspec {
        name: string;
        version: string;
        description: string;
        homepage: string;
        environment: Environment;
        dependencies: Dependencies;
        dev_dependencies: DevDependencies;
        dependency_overrides: DependencyOverrides;
    }

    export interface Latest {
        version: string;
        tags: any[];
        pubspec: Pubspec;
        archive_url: string;
    }

    export interface Flutter2 {
        sdk: string;
    }

    export interface Dependencies2 {
        flutter: Flutter2;
        meta: string;
        http: string;
        path_provider: string;
        flutter_svg: string;
        path_provider_macos: string;
        font_awesome_flutter: string;
        freezed_annotation: string;
        json_annotation: string;
        shared_preferences: string;
        shared_preferences_macos: string;
    }

    export interface Environment2 {
        sdk: string;
    }

    export interface FlutterTest2 {
        sdk: string;
    }

    export interface DevDependencies2 {
        flutter_test: FlutterTest2;
        pedantic: string;
        freezed: string;
        json_serializable: string;
        build_runner: string;
    }

    export interface DependencyOverrides2 {
        pedantic: string;
    }

    export interface Pubspec2 {
        version: string;
        name: string;
        dependencies: Dependencies2;
        author: string;
        description: string;
        homepage: string;
        environment: Environment2;
        dev_dependencies: DevDependencies2;
        dependency_overrides: DependencyOverrides2;
    }

    export interface Version {
        version: string;
        tags: any[];
        pubspec: Pubspec2;
        archive_url: string;
    }

    export interface RootObject {
        name: string;
        tags: any[];
        latest: Latest;
        versions: Version[];
    }

}
