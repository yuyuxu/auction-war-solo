/** Model (object) for front end game scene item.
 * @param {string} type - type of the item.
 */
function SceneItem(type) {
  /** Item category. */
  this.category = type;

  /** Item current location. */
  this.curr_location = LayoutSideNeutral;

  /** Item previous location. */
  this.prev_location = LayoutSideNeutral;

  /** Item render informations. */
  this.render = {
    icon : null;
  }
}
