import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, Form, FormGroup, FormText, ModalBody,
Label, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

 class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    } 
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
        
    }

    render() {
        return (
            <div>
                <Button outline className="fa fa-lg fa-pencil" onClick={this.toggleModal}>Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                        <div className="form-group">
                                <Label htmlFor="rating" md={2}>Rating</Label>
                                <Col md={10}>
                                    <Control.select model=".rating" id="rating" name="rating"
                                        placeholder="Rating"
                                        className="form-control">
                                            <option value="1">Select Rating</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        
                                        </Control.select>
                                        
                                </Col>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="author" md={2}>Your Name</Label>
                                <Col>
                                <Control.text model=".author" id="author" name="author"
                                placeholder="Your Name" className="form-control" 
                                validators={{
                                    required, 
                                    minLength: minLength(2),
                                    maxLength: maxLength(15)
                                }}/>
                                 <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="text" md={2}>Comment</Label>
                                <Col>
                                <Control.textarea model=".text" id="text" name="text"
                                placeholder="Your Comment" className="form-control" rows="6"/>
                                </Col>
                            </div>
                            <div className="form-group" md={{size: 10}}>
                                <Col>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </div>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}


function RenderCampsite({campsite}) {
    return (
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
   }

    function RenderComments ({comments, postComment, campsiteId}) {
       if (comments) {
           return (
               <div className="col-md-5 m-1">
                 <h4>Comments</h4>
                 <Stagger in>
                    {comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>
                                            {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </Stagger>
                 <div>
                     <CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>
               </div>
           );
       }
       return(
           <div></div>
       )
   }
    function CampsiteInfo(props) {
        if (props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        if (props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                </div>
            );
        }
        if (props.campsite) {
            return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
            </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments} 
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                        />
                </div>
            </div>
            );
        } 
            return <div />
            
        }
        

export default CampsiteInfo;

