import React from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { ExpansionList, ExpansionPanel } from 'react-md/lib/ExpansionPanels';
import Media, { MediaOverlay } from 'react-md/lib/Media';
import Avatar from 'react-md/lib/Avatars';
import Button from 'react-md/lib/Buttons';
import Divider from 'react-md/lib/Dividers';


export default class ExpandableMediaCard extends React.Component {
  render() {
  let readyVideoURLToShow = 'https://www.youtube.com/embed/' + (this.props.event.videoId || '-sUXMzkh-jI');
  console.log(readyVideoURLToShow);
  let view = { maxWidth: '70%' };
  if(this.props.mobile) view = { maxWidth: '95%' };

  return (
    <Card style={view} className="md-block-expanded md-block-centered">
    <div style={{marginLeft: 15, marginTop: 80}}>
      <div style={{display: 'flex'}}>
      <Button icon>description</Button>
      <h3 style={{padding: 10}}>Description:</h3>
      </div>
      <p>{this.props.event.description}</p>
    </div>
    <Divider/>
    <div style={{marginLeft: 15, display: 'flex'}}>
      <Button icon>timelapse</Button>
      <p style={{padding: 16, margin: 0}}>{`${new Date(this.props.event.start).toString().slice(4, 24)}`}</p>
      <p style={{padding: 16, margin: 0}}>{new Date(new Date(this.props.event.start).valueOf()+this.props.event.duration).toString().slice(4, 24)}</p>
    </div>
    <Divider/>
    <Media className="iframe-wrapper">
      <iframe className="move-on-top" src={readyVideoURLToShow} frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
      <MediaOverlay>
      <CardTitle title={this.props.event.videoId ? "Lesson record" : "Lesson record isn't uploaded still"} subtitle={this.props.event.videoId || 'avaliable soon...'}>
        <Button className="md-cell--right" icon>play_circle_filled</Button>
      </CardTitle>
      </MediaOverlay>
    </Media>
    <Media className="iframe-wrapper">
      <iframe className="move-on-top" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d698.4331681038012!2d27.68178244677689!3d53.92748365509798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcebc7c83cb35%3A0xc659f43cf70964d5!2zdnVs0ZbRgWEgQWthZNC1bdGWa2EgS3VwctC1dtGWxI1hIDEvMiwgTWluc2sgMjIwMTQx!5e0!3m2!1sen!2sby!4v1496747626981" frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
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
    <ExpansionList style={{ padding: 16 }}>
      <ExpansionPanel
        label="Resourses"
        contentClassName="md-grid">
          <CSSTransitionGroup
            component="section"
            transitionName="opacity"
            transitionEnterTimeout={1000}
            transitionLeave={false}
          >
            {this.props.event.resources.map((resource, i) => (
              <div key={i}>
              <h4>Type: {resource.type}</h4>
              <p>{resource.description}</p>
              <Button className="md-cell--right" flat children="Link" href={resource.resource} target="_blank"/>
              <Divider/>
              </div>
            ))}
          </CSSTransitionGroup>
      </ExpansionPanel>
    </ExpansionList>
    <Button
      tooltipPosition="top"
      tooltipLabel="send feedback"
      href="mailto:xeontem@gmail.com"
      floating
      secondary
      fixed>mail_outline
    </Button>
    </Card>
  )}
}
