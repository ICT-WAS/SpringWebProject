import { Dropdown, DropdownButton } from "react-bootstrap";

export default function NotificationButton() {
    return (
      <>
        <DropdownButton
          variant="outline-secondary"
          title="알림🔔"
          id="input-group-dropdown-2"
          align="end"
        >
  
          <Dropdown.Item href="#">모두 알림</Dropdown.Item>
          <Dropdown.Item href="#">일반 알림</Dropdown.Item>
          <Dropdown.Item href="#">특별 알림</Dropdown.Item>
        </DropdownButton>
      </>
    );
  }