import Card from 'react-bootstrap/Card';

function CardComponent({onClick, path, cardTitle, cardText, memberID, size}){
    
    return (
        <>
            <Card onClick={onClick} style={{ width: `${size}` }} className={memberID} key={memberID}>
                <Card.Img variant="top" src={path}/>
                <Card.Body>
                <Card.Title>{cardTitle}</Card.Title>
                <Card.Text>
                    {cardText}
                </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}

export default CardComponent;