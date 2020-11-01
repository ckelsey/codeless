import Get from "../objects/get";

export default function GetEventTarget(event: Event): HTMLElement | undefined {
    return Get(event, 'path.0', Get(event, 'composedPath().0', Get(event, 'originalTarget', Get(event, 'explicitOriginalTarget', Get(event, 'target')))))
}
