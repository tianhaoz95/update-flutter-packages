import { setFailed } from "@actions/core"
import { initContext } from "./init"
import { updateFlutterWorkspace } from "./upgrade"
import { maybeOpenPullRequest } from "./pull"

async function main() {
    try {
        const context = initContext();
        await updateFlutterWorkspace(context);
        if (context.needPr)
            await maybeOpenPullRequest(context);
    } catch (error) {
        setFailed(error.message);
    }
}

main();
