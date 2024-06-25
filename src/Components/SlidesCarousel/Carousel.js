import Carousel from 'react-bootstrap/Carousel';
import Slide from './Slides/Slide';
import "./Carousel.css"

function CarouselComponent({images, time, size}) {
  if (size === "small"){
    var height = "500px";
  }
    
  const carouselArray = images.map((image, index) => {
     
    
    const carousel = (
    <Carousel.Item interval={1000*time} key={index} className='p-5' style={{ textAlign: 'center' }}>
        <Slide slidePicture={image} />
        <Carousel.Caption>
        <h3>{index} slide label</h3>
        <p>{index} - Description</p>
        </Carousel.Caption>
    </Carousel.Item>
    )
    return carousel;        
});

  return (
    <Carousel className='custom-carousel bg-dark p-2' style={size==="small" ? {position: "absolute", top: "52%", left: "50%", transform: "translate(-50%, -50%)"}: null}>
      {carouselArray}
    </Carousel>
  );
}

export default CarouselComponent;