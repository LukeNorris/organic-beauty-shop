import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'


const Footer = () => {
    return (
        <footer>
            <Container>
              <Row>
                  <Col classname="text-center py-3">
                   Copyriight &copy; Organic Beauty
                  </Col>
              </Row>
            </Container>
        </footer>
    )
}

export default Footer