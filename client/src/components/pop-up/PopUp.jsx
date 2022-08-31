import React from 'react'
import {
    CSSTransition,
    TransitionGroup,
  } from 'react-transition-group';

 const PopUp = ({children, ...props}) => {

  return (
      <TransitionGroup>
        <CSSTransition
           {...props}
           timeout={500}
           classNames={'file'}
           exist={false}>
            {children}
        </CSSTransition>
      </TransitionGroup>
  );
};

export default PopUp;
