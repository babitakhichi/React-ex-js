import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { GlobalLoader } from "../../../../components";
import { ManageCmsServices } from "../../../../services/User";
import { logger, modalNotification, stringToHTML } from "../../../../utils";

function PrivacyPolicy() {
  const [privacyPolicyData, setPrivacyPolicyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getPrivacyPolicyData = async () => {
    setLoading(true);
    try {
      let queryParams = { pageKey: "privacy_policy" };
      const res = await ManageCmsServices.commonServices({ queryParams });
      const { success, data, message } = res;
      if (success === 1) {
        setPrivacyPolicyData(data?.pageContent);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPrivacyPolicyData();
  }, []);

  return (
    <>
      <section className="py-70">
        <Container>
          {loading ? (
            <GlobalLoader />
          ) : (
            <>
              <div className="heading">
                <h3 className="heading_sub font-ad">
                  {" "}
                  {t("text.common.privacy")}
                </h3>

                <h1 className="heading_main">
                  {t("text.privacyPolicy.privacyPolicyDaakia")}
                </h1>
              </div>
              <div className="cmsPage">
                {loading ? (
                  <GlobalLoader />
                ) : privacyPolicyData?.length > 0 ? (
                  <p>{stringToHTML(privacyPolicyData)}</p>
                ) : (
                  <p className="text-center noRecord mb-0">
                    {" "}
                    {t("text.common.noRecord")}
                  </p>
                )}
              </div>
            </>
          )}
          {/* <div className="heading">
            <h3 className="heading_sub font-ad">Privacy</h3>
            <h1 className="heading_main">Privacy Policy For Daakia</h1>
          </div>
          <div className="cmsPage">
            <h4>
              Thank you for using Daakia! Your privacy is important to us. To
              better protect your privacy we provide this privacy policy.
            </h4>
            <h5>SCOPE:</h5>
            <ol>
              <li>
                <p>
                  Daakia Pvt. Ltd. and/or its affiliates (hereinafter referred
                  to as “DPL” “Company” “we” “our” “us”) is committed to
                  protecting the privacy of the users (“you” “your” “yourself”
                  “user”) of its Daakia application offered by the Company
                  (hereinafter referred to as “Daakia”) and has provided this
                  privacy policy (“Policy”) which outlines Daakia’s privacy
                  practices regarding the collection, use and safeguard of your
                  information through Daakia and the services offered thereupon.
                </p>
              </li>
              <li>
                <p>
                  This Policy forms an integral part of the End User License
                  Agreement available at insert link of EULA (“EULA”) and should
                  be read in consonance with the EULA. Capitalized terms which
                  have been used here but are undefined shall have the same
                  meaning as attributed to them in the EULA.
                </p>
              </li>
              <li>
                <p>
                  Your clicking of the “I Agree” button and submission of
                  personal information or if you are a minor, the submission of
                  your personal information either by your parents (or your
                  guardian) or by you with the permission of your parents (or
                  guardian) to Daakia will be deemed as your acceptance of this
                  Policy.
                </p>
              </li>
              <li>
                <p>
                  This Policy shall be construed as provide/d in compliance with
                  Information Technology Act, 2000 as amended and read with the
                  Information Technology (Reasonable Security Practices and
                  Procedures and Sensitive Personal Data or Information) Rules,
                  2011.
                </p>
              </li>
            </ol>
            <h5>CHANGES TO THE PRIVACY POLICY:</h5>
            <ol>
              <li>
                <p>
                  We are obligated to protect your information in accordance
                  with applicable laws, and regulations.
                </p>
              </li>
              <li>
                <p>
                  This Policy is subject to modification based on changes in the
                  business, legal and regulatory requirements and will be
                  updated online. We will make all efforts to communicate any
                  significant changes to this Policy to you. You are encouraged
                  to periodically visit this page to review the Policy and any
                  changes to it.
                </p>
              </li>
            </ol>
            <h5>THIRD PARTY SERVICES</h5>
            <ol>
              <li>
                <p>
                  Please note that your mobile service provider, mobile
                  operating system provider, third party applications (including
                  the applications pre-loaded on your smart phones powered by
                  Android/iOS platform or customized Android ROM
                  (&quot;Device&quot;), social media platforms and websites that
                  you access may also collect, use and share information about
                  you and your usage. We cannot control how these third parties
                  collect, use, share or secure this information. For
                  information about third-party privacy practices, please
                  consult their respective privacy policies.
                </p>
              </li>
            </ol>
            <h5>PERSONAL INFORMATION WE COLLECT:</h5>
            <ol>
              <li>
                <p>
                  Personal information is defined as information that can be
                  used to identify you and may include details such as your
                  name, age, gender, contact information, products and services
                  you are interested in or require more information about.
                  Insofar as sensitive personal information is concerned, it
                  will carry the meaning as may be defined by applicable laws
                  from time to time.
                </p>
              </li>
              <li>
                <p>
                  The following is the manner in which we collect, use, share
                  and retain personal information:
                </p>
              </li>
            </ol>
            <h5>2.1 Collection</h5>
            <p>
              (a) You agree that Daakia may collect such personal information,
              whenever relevant, to help provide you with information and to
              complete any transaction or provide any product you have requested
              or authorized. You also consent to the collection of certain
              personal information in the course of your applying for the
              products and/or services.
            </p>
            <h5>2.2 Usage </h5>
            <div>
              <p>(a) Daakia seeks this information either to:</p>
              <ul>
                <li>
                  <p>
                    validate and process your request for the services of Daakia
                    or information;
                  </p>
                </li>
                <li>
                  <p>to improve the quality of Daakia;</p>
                </li>
                <li>
                  <p>
                    to assist you to determine which services best meet your
                    needs; or
                  </p>
                </li>
                <li>
                  <p>
                    to facilitate our internal business operations, including
                    the fulfilment of any legal and regulatory requirements; or
                  </p>
                </li>
                <li>
                  <p>
                    to provide you with recommendation about services you may be
                    interested in, based on your use of Daakia; or
                  </p>
                </li>
                <li>
                  <p>
                    to provide you with marketing communications and advertising
                    that Daakia believe may be of interest of you; or
                  </p>
                </li>
                <li>
                  <p>to facilitate your purchases;</p>
                </li>
                <li>
                  <p>any other services Daakia undertakes to provide.</p>
                </li>
              </ul>
            </div>
            <h5>2.3 Sharing </h5>
            <div>
              <p>
                (a)We may disclose personal information to our affiliates when
                necessary to perform services on our behalf or on your behalf,
                to provide display advertising and promotional services,
                providing search results and links (including paid listings and
                links), processing credit card payments, providing customer
                service etc.
              </p>
              <p>
                (b)We may also share personal information with external
                organizations or individuals if we believe that access, use,
                preservation or disclosure of the information is reasonably
                necessary to:
              </p>
              <ul>
                <li>
                  <p>
                    meet any applicable law, regulation, legal process or
                    enforceable governmental request;
                  </p>
                </li>
                <li>
                  <p>
                    detect, prevent or otherwise address fraud, security or
                    technical issues; and
                  </p>
                </li>
                <li>
                  <p>
                    protect against harm to the rights, property or safety of
                    our customers or the public, as required or permitted by
                    law.
                  </p>
                </li>
              </ul>
            </div>
            <h5>2.4 Retention </h5>
            <div>
              <p>
                The information so collected shall be retained only for a
                limited duration necessary to fulfil the purposes outlined
                herein unless a longer retention period is required or permitted
                by law and only for the purposes defined above. Once the purpose
                is achieved, all personal information is deleted in a safe and
                secure mode.
              </p>
            </div>
            <h5>2.5 End-to-End Encrypted Data </h5>
            <div>
              <p>
                Your messages, media and files from instant messages/ chat are
                end-to-end encrypted and are processed only on your device and
                on the device of your recipient. The end-to-end encryption of
                audio/ video calling or conferencing can be enabled in cromium
                browser 84 and above. Before this data reaches our servers, it
                is encrypted with a key known only to you and the recipient.
                While Daakia servers will handle this end-to-end encrypted data
                to deliver it to the recipient, we have no ways of deciphering
                the actual information. In this case, we neither store nor
                process your personal data, rather we store and process random
                sequences of symbols that have no meaning without the keys which
                we don’t have.
              </p>
            </div>
            <h5>NON-PERSONAL INFORMATION:</h5>
            <ol>
              <li>
                <p>
                  Non-personal information is defined as any data that does not
                  personally identify you and may include unique system or
                  hardware identifiers, system or application software, and
                  peripherals.
                </p>
              </li>
              <li>
                <p>
                  Any non-personal information, when clubbed with personal
                  information shall be treated as personal information. You may
                  at any time, opt-out of sharing the same.
                </p>
              </li>
              <li>
                <p>
                  The following is the manner in which we collect, use, share
                  and retain non-personal information.
                </p>
              </li>
            </ol>
            <h5>3.1 Collection:</h5>
            <div>
              <p>
                You agree that Daakia may collect diagnostic, technical, usage
                related information, for the usage purposes described below.
              </p>
            </div>
            <h5>3.2 Usage:</h5>
            <div>
              <p>
                The abovementioned information is gathered periodically to
                provide and improve Daakia and services therein, facilitate the
                provision of software updates, product support and other
                services to you (if any) and to verify compliance with the terms
                of this Policy.
              </p>
            </div>
            <h5>3.3 Sharing:</h5>
            <div>
              <p>
                To enable Daakia partners and third-party developers to improve
                their software, hardware and services designed for use with
                Daakia, we may also provide any such partner or third-party
                developer with a subset of diagnostic information that is
                relevant to that partner’s or developer’s software, hardware
                and/or services, as long as the diagnostic information is in a
                form that does not personally identify you.
              </p>
            </div>
            <h5>3.4 Retention:</h5>
            <div>
              <p>
                The information so collected shall be retained only for a
                limited duration necessary to fulfill the purposes outlined
                herein unless a longer retention period is required or permitted
                by law and only for the purposes defined above. Once the purpose
                is achieved, all information is deleted in a safe and secure
                mode.
              </p>
            </div>
            <h5>LOCATION SERVICES:</h5>
            <ol>
              <li>
                <p>
                  Daakia, its licensees and agents, may access, collect and
                  analyse your usage of Daakia and other information related to
                  your location on a regular basis through Bluetooth and Wi-Fi
                  signals and other technologies and data for the performance of
                  the services provided by Daakia and to help improve the
                  design, functionality, performance, and content of Daakia. In
                  order to collect geo-location information, the location
                  settings must be enabled on your Device. Therefore, in some
                  cases, Daakia may request that you enable the location
                  settings.
                </p>
              </li>
              <li>
                <p>
                  Except in cases where any specific services requested by you
                  require or involve personal identification, Daakia collects
                  location data anonymously and in a form that does not
                  personally identify you. By using Daakia, you agree and
                  consent to transmission, collection, maintenance, processing
                  and use of your location data and queries to provide and
                  improve such services of Daakia
                </p>
              </li>
            </ol>
            <h5>COOKIES</h5>
            <ol>
              <li>
                <p>
                  Information collected by cookies and other technologies are
                  treated as non-personal information. However, to the extent
                  that IP addresses or similar identifiers are considered
                  personal information by local law, we treat any information
                  linked to such identifiers as personal information. Similarly,
                  to the extent that non-personal information is combined with
                  personal information, we will treat the combined information
                  as personal information.
                </p>
              </li>
            </ol>
            <h5>OTHER INFORMATION DAAKIA COLLECTS</h5>
            <ol>
              <li>
                <p>
                  Daakia may also collect other information about you in ways
                  that Daakia describes to you or otherwise with your consent.
                  You can choose not to provide us with certain types of
                  information, but doing so may affect your ability to avail
                  and/or use some services.
                </p>
              </li>
              <li>
                <p>
                  At the time of installation of the Daakia, Daakia will require
                  your permission to enable it to find the location of your
                  Device, modify or delete SD card contents, read phone
                  statistics and identity, mount and un-mount file systems, etc.
                  You acknowledge that you are agree to providing such
                  information to Daakia.
                </p>
              </li>
              <li>
                <p>
                  The features of Daakia may allow you to post content such as
                  profile information, status update, comments, and other
                  content and/or information (User Content). The ownership over
                  the User Content created by you remains with you; however, by
                  sharing User Content through Daakia, you agree to allow others
                  to view and/or share your User Content in accordance with this
                  Policy.
                </p>
              </li>
              <li>
                <p>
                  Daakia may enable you to invite your friends to use Daakia by
                  sending them an invitation email or message. You may do so by:
                  (i) using Daakia to send or post an invitation message to your
                  friend’s external email address or his contact information. If
                  you send or post an invitation message, we may collect
                  personal information about the recipient such as their email
                  address or their third-party website account user name
                </p>
              </li>
            </ol>
            <h5>THIRD PARTY APPLICATIONS, WEBSITES &amp; SERVICES</h5>
            <ol>
              <li>
                <p>
                  Daakia may include links to other websites/applications or may
                  display advertisements from third parties and other content
                  that links to third party websites. Such websites/applications
                  are governed by their respective privacy policies, which are
                  out of Daakia’s control. Once you leave our servers, use of
                  any information you provide is governed by the privacy policy
                  of the operator of the website / application you are visiting.
                  That policy may differ from that of Daakia. If you can&apos;t
                  find the privacy policy of any of such websites /application
                  via a link from the website&apos;s homepage, you should
                  contact the relevant website /application directly for more
                  information.
                </p>
              </li>
            </ol>
            <h5>ACCESS, CORRECTION AND DELETION</h5>
            <ol>
              <li>
                <p>
                  Daakia strives hard to keep its records updated and accurate
                  with your latest information. You shall be responsible to
                  ensure that the information or data you provide from time to
                  time is and shall be correct, current and updated and you have
                  all the rights, permissions and consents to provide such
                  information or data.
                </p>
              </li>
              <li>
                <p>
                  You may note that deletion of certain information or
                  withdrawal of consent may lead to cancellation of your access
                  to Daakia or your access to certain features and services of
                  Daakia. Additionally, we may not be able to process your
                  request of correction, updating or deletion, in case the same
                  is not supported by valid documents or data retention is
                  required by the applicable law or law enforcement requests or
                  under any judicial proceedings or it is extremely difficult to
                  implement (such as requests related to backup copies or if a
                  new system is required to process the request or change of
                  technical design) or risks the privacy of other users.
                </p>
              </li>
            </ol>
            <h5>INFORMATION SECURITY AND STORAGE</h5>
            <ol>
              <li>
                <p>
                  The Company uses reasonable security measures, at the minimum
                  those mandated under the Information Technology Act, 2000 as
                  amended and read with Information Technology (Reasonable
                  Security Practices and Procedures and Sensitive Personal Data
                  or Information) Rules, 2011, to safeguard and protect your
                  data and information. The Company implements such measures, as
                  stated above, to protect against unauthorized access to, and
                  unlawful interception of, personal information. You accept the
                  inherent security implications of providing unencrypted
                  information over Internet/ cellular/data/ Wi-Fi networks and
                  will not hold the Company responsible for any breach of
                  security or the disclosure of personal information unless the
                  Company has been grossly and wilfully negligent.
                </p>
              </li>
              <li>
                <p>
                  Notwithstanding anything contained in this Policy or
                  elsewhere, the Company shall not be held responsible for any
                  loss, damage or misuse of your information, if such loss,
                  damage or misuse is attributable to a Force Majeure Event. A
                  &quot;Force Majeure Event&quot; shall mean any event that is
                  beyond the reasonable control of the Company and shall
                  include, without limitation, sabotage, fire, flood, explosion,
                  acts of God, civil commotion, strikes or industrial action of
                  any kind, riots, insurrection, war, acts of government,
                  computer hacking, unauthorized access to computer data and
                  storage device, computer crashes, breach of security and
                  encryption, etc.
                </p>
              </li>
            </ol>
            <h5>QUERIES AND COMPLAINTS</h5>
            <ol>
              <li>
                <p>
                  We are committed to protect your personal information
                  collected and processed by us and look forward to your
                  continued support for the same. In case of any feedback or
                  concern regarding protection of your personal information, or
                  any privacy-related feedback or concerns you may contact{" "}
                  <span> insert customer care email address</span>
                  <br />
                  <br /> Last Updated:{" "}
                  <span>Insert date of uploading policy.</span>Copyright © 2021,
                  DPL. All rights reserved.
                </p>
              </li>
            </ol>
          </div> */}
        </Container>
      </section>
    </>
  );
}

export default PrivacyPolicy;
