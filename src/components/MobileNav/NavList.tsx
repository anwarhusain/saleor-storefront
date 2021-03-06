import * as React from "react";
import { Link } from "react-router-dom";
import ReactSVG from "react-svg";

import { baseUrl } from "../App/routes";
import NavItem from "./NavItem";

const backIcon = require("../../images/arrow-back.svg");
const logoIcon = require("../../images/logo.svg");

interface NavListProps {
  items: NavItem[];
  hideOverlay(): void;
}

interface NavListState {
  parent: NavItem | null;
  displayedItems: NavItem[];
}

class NavList extends React.PureComponent<NavListProps, NavListState> {
  state: NavListState = {
    displayedItems: this.props.items,
    parent: null
  };


  handleShowSubItems = (item: NavItem) => {
    this.setState({ parent: item, displayedItems: item.children });
  };

  handleGoBack = () => {
    const grandparent = this.state.parent.parent;

    if (!grandparent) {
      this.setState({ parent: null, displayedItems: this.props.items });
    } else {
      const newParent = this.findItemById(grandparent.id);
      this.setState({
        displayedItems: newParent.children,
        parent: newParent
      });
    }
  };

  findItemById(id: string): NavItem {
    let match = null;
    function find(item) {
      if (item.id === id) {
        match = item;
        return true;
      }
      return item.children && item.children.some(find);
    }
    this.props.items.some(find);
    return match;
  }

  render() {
    const { hideOverlay } = this.props;
    const { displayedItems, parent } = this.state;

    return (
      <ul>
        {parent ? (
          <li className="side-nav__menu-item side-nav__menu-item--parent">
            <span
              className="side-nav__menu-item-back"
              onClick={this.handleGoBack}
            >
              <ReactSVG path={backIcon} />{" "}
              {parent.name}
            </span>
          </li>
        ) : (
          <>
            <li className="side-nav__menu-item side-nav__menu-item--parent">
              <Link
                to={baseUrl}
                className="side-nav__menu-item-logo"
                onClick={hideOverlay}
              >
                <ReactSVG path={logoIcon} />
              </Link>
              <span className="side-nav__menu-item-close" onClick={hideOverlay}>
                <span />
              </span>
            </li>
            <li className="side-nav__menu-item">
              <Link
                to={baseUrl}
                className="side-nav__menu-item-link"
                onClick={hideOverlay}
              >
                Home
              </Link>
            </li>
          </>
        )}

        {displayedItems.map(item => (
          <NavItem
            key={item.id}
            hideOverlay={hideOverlay}
            showSubItems={this.handleShowSubItems}
            {...item}
          />
        ))}
      </ul>
    );
  }
}

export default NavList;
