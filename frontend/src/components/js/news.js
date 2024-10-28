import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/news/')
            .then(response => {
                setNews(response.data);
                setLoading(false);
                console.log(response)
            })
            .catch(error => {
                console.error('Ошибка при загрузке новостей:', error);
                setError('Не удалось загрузить новости.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Новости криптовалют</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {news.map((article, index) => (
                    <Col key={index}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                        {article.title}
                                    </a>
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default News;