import { Select } from "antd";
import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ImageElement } from "..";

import "./index.scss";

export default function Tabs({
  tabContent,
  tabsFor,
  setActiveKey,
  activeKey,
  onTabChange,
  tabWithToggle,
  asideToggle,
  asideView,
  navDivClassName,
  navClass,
  codeData,
  priceMonth,
  setPriceMonth,
  navLinkClass,
  pills,
  pillasClassName,
}) {
  const [key, setKey] = useState(tabContent[0]?.key);

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
        {/* <Row> */}
        {tabsFor === "table" ? (
          <div className={navDivClassName || "card"}>
            <Nav
              variant={pills ? "pills" : "tabs"}
              className={
                pillasClassName ||
                (!pills && "nav-tabs-mb-icon nav-tabs-card border-0")
              }
            >
              {tabContent?.map((item) => {
                return (
                  <Nav.Item>
                    <Nav.Link eventKey={item.key}>
                      {item.navIcon && (
                        <ImageElement
                          source={item.navIcon}
                          alt="Video-conferencing"
                        />
                      )}
                      {item.icon && <em className={item.icon} />}
                      <span>{item.name}</span>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
            {codeData && (
              <div className="form-group mb-0 ms-sm-3">
                <Select
                  defaultValue="monthly"
                  options={codeData}
                  value={priceMonth}
                  onChange={setPriceMonth}
                />
                {/* <AntSelect
                name="monthly"
                defaultValue="Monthly"
                placeholder="Select"
                arrayOfData={codeData}
              /> */}
              </div>
            )}
          </div>
        ) : (
          <Nav
            // variant="tabs"
            variant={pills ? "pills" : "tabs"}
            className={navClass || "nav-tabs-mb-icon nav-tabs-card"}
          >
            <>
              {tabContent?.map((item) => {
                return (
                  <Nav.Item>
                    <Nav.Link
                      eventKey={item.key}
                      className={navLinkClass || ""}
                    >
                      {item.icon && <em className={item.icon} />}
                      {item.title && (
                        <div className="tabTitle">
                          <p className="mb-0 font-sb">{item.title}</p>
                          <span>{item.subTitle}</span>
                        </div>
                      )}
                      {item.name && <span>{item.name}</span>}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
              {tabWithToggle && (
                <Nav.Item className={tabWithToggle}>
                  <Link
                    to="#"
                    onClick={() => asideToggle()}
                    className={`toggle btn btn-icon btn-trigger ${
                      asideView ? "active" : ""
                    }`}
                  >
                    <em className="icon ni ni-user-list-fill" />
                  </Link>
                </Nav.Item>
              )}
            </>
          </Nav>
        )}
        {tabsFor === "video" ? (
          <Tab.Content>
            {tabContent?.map((item) => {
              return <Tab.Pane eventKey={item.key}>{item.content}</Tab.Pane>;
            })}
          </Tab.Content>
        ) : (
          <div
            className={
              tabsFor === "table" && pills
                ? ""
                : tabsFor === "table"
                ? "mt-3"
                : ""
            }
          >
            <Tab.Content>
              {tabContent?.map((item) => {
                return <Tab.Pane eventKey={item.key}>{item.content}</Tab.Pane>;
              })}
            </Tab.Content>
          </div>
        )}
        {/* </Row> */}
      </Tab.Container>
    </>
  );
}
