"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const init_1 = require("./init");
const upgrade_1 = require("./upgrade");
const pull_1 = require("./pull");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = init_1.initContext();
            yield upgrade_1.updateFlutterWorkspace(context);
            if (context.needPr)
                yield pull_1.maybeOpenPullRequest(context);
        }
        catch (error) {
            core_1.setFailed(error.message);
        }
    });
}
main();
