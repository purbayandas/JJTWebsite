import Button from 'react-bootstrap/Button';

function ButtonComponent({label, type, size, onClick}) {
  return (
    <>      
      <Button variant={`outline-${type}`} size={size} onClick={onClick}>{label}</Button>{' '}      
    </>
  );
}

export default ButtonComponent;