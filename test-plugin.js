module.exports = function (_ref) {
    var t = _ref.types;

    const getType = annotation => {
        if (annotation == 'TSNumberKeyword') { return 'number' }
        if (annotation == 'TSStringKeyword') { return 'string' }
        return ''
    }

    return {
        visitor: {
            Identifier: {
                enter(path, state) {
                    if (path.node.typeAnnotation && path.node.typeAnnotation.typeAnnotation) {
                        path.node.comments = [`/* @param {${getType(path.node.typeAnnotation.typeAnnotation.type)}} ${path.node.name} */`]
                        // console.log(path)
                        // if (!path.node.leadingComments) {
                        //     path.node.leadingComments = new WeakSet()
                        // }
                        // path.node.leadingComments.add(`/* @param {${getType(path.node.typeAnnotation.typeAnnotation.type)}} ${path.node.name} */`)
                    }
                }
            }
        }
    }
};