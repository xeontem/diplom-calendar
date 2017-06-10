import React from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Media, { MediaOverlay } from 'react-md/lib/Media';
import Avatar from 'react-md/lib/Avatars';
import Button from 'react-md/lib/Buttons';
import Divider from 'react-md/lib/Dividers';


export default class ExpandableMediaCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    let view = { maxWidth: '70%' };
    if(this.props.mobile) view = { maxWidth: '95%' };

    return (
      <Card style={view} className="md-block-expanded md-block-centered">
        <Media>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d698.4331681038012!2d27.68178244677689!3d53.92748365509798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcebc7c83cb35%3A0xc659f43cf70964d5!2zdnVs0ZbRgWEgQWthZNC1bdGWa2EgS3VwctC1dtGWxI1hIDEvMiwgTWluc2sgMjIwMTQx!5e0!3m2!1sen!2sby!4v1496747626981" frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
          <MediaOverlay>
            <CardTitle title="Location" subtitle={this.props.event.location}>
              <Button className="md-cell--right" icon>place</Button>
            </CardTitle>
          </MediaOverlay>
        </Media>
        {this.props.speakers.map((speaker, i) => (
                  <CardTitle
                    key={i}
                    title="Speaker"
                    subtitle={speaker.name}
                    avatar={<Avatar src={speaker.avatar} alt="Avat" role="presentation" random />}
                  />
        ))}
        <Divider/>
        <div style={{marginLeft: 15}}>
          <h3>Description:</h3>
          <p>{this.props.event.description}</p>
        </div>
        <Divider/>
        <div style={{marginLeft: 15}}>
          <h3>{`Starts: ${new Date(this.props.event.start).toString().slice(4, 24)} Ends: ${new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(4, 24)}`}</h3>
        </div>
        <Divider/>
        <CardActions expander>
          <Button flat label="Resources" />
        </CardActions>
        {this.props.event.resources.map((resource, i) => (
                  <CardText
                    key={i*20}
                    title="resources"
                    expandable
                  >
                    <h4>Type: {resource.type}</h4>
                    <p>{resource.description}</p>
                    <Button className="md-cell--right" flat label="Link" href={resource.resource} target="_blank"/>
                    <Divider/>
                  </CardText>
                  ))}
      </Card>
  )}
}
