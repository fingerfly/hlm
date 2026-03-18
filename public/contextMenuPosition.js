/**
 * Purpose: Compute safe slot-menu position in viewport.
 * Description:
 * - Prefers below-slot placement when there is enough room.
 * - Flips above slot if bottom space is limited.
 * - Clamps horizontal position to stay in viewport bounds.
 */
const GAP_PX = 4;
const EDGE_PX = 8;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Compute fixed-position menu coordinates near one slot element.
 *
 * @param {{left:number,right:number,top:number,bottom:number}} targetRect
 * @param {{width:number,height:number}} menuBox
 * @param {{width:number,height:number}} viewport
 * @returns {{left:number, top:number, placement:"top"|"bottom"}}
 */
export function computeContextMenuPosition(targetRect, menuBox, viewport) {
  const leftPreferred = targetRect.left;
  const leftMax = Math.max(EDGE_PX, viewport.width - menuBox.width - EDGE_PX);
  const left = clamp(leftPreferred, EDGE_PX, leftMax);
  const spaceBottom = viewport.height - targetRect.bottom - EDGE_PX;
  const spaceTop = targetRect.top - EDGE_PX;
  const placeBottom =
    spaceBottom >= menuBox.height + GAP_PX || spaceBottom >= spaceTop;
  const top = placeBottom
    ? clamp(targetRect.bottom + GAP_PX, EDGE_PX, viewport.height - EDGE_PX)
    : clamp(
      targetRect.top - menuBox.height - GAP_PX,
      EDGE_PX,
      viewport.height - menuBox.height - EDGE_PX
    );
  return { left, top, placement: placeBottom ? "bottom" : "top" };
}
