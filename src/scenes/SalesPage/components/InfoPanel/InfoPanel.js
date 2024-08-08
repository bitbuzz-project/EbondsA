import classes from './InfoPanel.module.scss'

const InfoPanel = ({content}) => {
    return (<div className={classes.infoPanel}>
        <h1>
            {content.title}
        </h1>
        <p>
            {content.text}
        </p>
    </div>);
}
 
export default InfoPanel;