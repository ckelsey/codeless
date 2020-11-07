import { parse } from "@babel/parser"
import TransformTS from "./transform-ts"

function getAst(content: string) {
    const parsed = parse(
        TransformTS(content),
        {
            sourceType: "module"
        }
    )

    return parsed
}

export default getAst