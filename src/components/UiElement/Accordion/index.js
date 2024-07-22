import React from "react";
import parse from "html-react-parser";
import { Accordion } from "react-bootstrap";

function AccordionComponent({ AccordionContent }) {
  return (
    <Accordion defaultActiveKey={0}>
      {AccordionContent.map((item, key) => {
        return (
          <Accordion.Item eventKey={key} key={key}>
            <Accordion.Header>{`${item?.question}`}</Accordion.Header>
            <Accordion.Body>
              <p>{parse(item?.answer)}</p>
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

export default AccordionComponent;
