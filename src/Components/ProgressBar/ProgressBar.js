import ProgressBar from 'react-bootstrap/ProgressBar';

function ProgressBarComponent({now}) {
  
  return <ProgressBar now={now} label={`${now}%`} variant='success' animated={now !== 100} />;
}

export default ProgressBarComponent;