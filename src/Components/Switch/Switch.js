import Form from 'react-bootstrap/Form';
import "./SwitchStyles.css"

function SwitchComponent({switchLabel, onChange}) {
  return (
    <Form >
      <Form.Check // prettier-ignore
        type="switch"
        id="custom-switch"
        label={switchLabel}
        onChange={onChange}               
      />      
    </Form>
  );
}

export default SwitchComponent;