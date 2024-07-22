import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { Tab, Nav, Col, Row } from "react-bootstrap";

import "./index.scss";

export default function VerticalTabs({
  tabContent,

  setActiveKey,
  activeKey,
  onTabChange,

  verticalTabsDivClass,
}) {
  const [key, setKey] = useState(tabContent[0].key);

  return (
    <>
      <Tab.Container
        id="controlled-tab-example"
        defaultActiveKey={key}
        activeKey={activeKey}
        onSelect={(k) => {
          setKey(k);
          if (setActiveKey) {
            setActiveKey(k);
          }
          if (onTabChange) {
            onTabChange(k);
          }
        }}
      >
        {" "}
        <Row>
          <Col lg={3}>
            <div className={verticalTabsDivClass || "verticalTabs"}>
              <Nav variant="pills" className="flex-column">
                {tabContent.map((item) => {
                  return (
                    <Nav.Item>
                      <Nav.Link
                        className="d-flex align-items-center"
                        eventKey={item.key}
                      >
                        {item.icon && <em className={item.icon} />}
                        <span>{item.name}</span>
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </div>
          </Col>

          <Col lg={9} className="mt-3 mt-lg-0">
            {" "}
            <Tab.Content>
              {tabContent.map((item) => {
                return <Tab.Pane eventKey={item.key}>{item.content}</Tab.Pane>;
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}
