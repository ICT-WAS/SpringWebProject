import { Dropdown, DropdownButton } from "react-bootstrap";

export default function NotificationButton() {
    return (
      <>
          <Dropdown>
          <Dropdown.Toggle variant="warning" className='dropdown-transparent' >
          <i className="bi bi-bell"/>알림
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">모두 알림</Dropdown.Item>
        <Dropdown.Item href="#/action-2">일반 알림</Dropdown.Item>
        <Dropdown.Item href="#/action-3">특별 알림</Dropdown.Item>
      </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }