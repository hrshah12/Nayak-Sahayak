// This service simulates fetching case data from a remote source.
// In a real-world application, this would involve a backend service
// that scrapes or connects to court website APIs.
// The following data is structured to be representative of real cases
// found on portals like the National Judicial Data Grid (NJDG).

export interface CaseData {
  id: string;
  court: 'Supreme Court' | 'High Court' | 'Local Court';
  text: string;
}

const sampleCases: CaseData[] = [
  {
    id: 'SC/SLP(C)/1102/2024',
    court: 'Supreme Court',
    text: `Case Type: Special Leave to Appeal (C). Petitioner: M/S Powergrid Corporation of India Ltd. vs. Respondent: M/S Jyoti Structures Ltd. Subject: Dispute arising from an arbitral award related to a contract for the construction of transmission lines. The core issue is whether the High Court erred in setting aside the arbitral award on the grounds of 'patent illegality'. The case involves a substantial question of law concerning the scope of judicial review under Section 34 of the Arbitration and Conciliation Act, 1996. The outcome could impact numerous high-value infrastructure contracts.`
  },
  {
    id: 'HC/BOM/WP/543/2023',
    court: 'High Court',
    text: `Case Type: Writ Petition. Petitioner: All India Bank Employees Association vs. Respondent: Reserve Bank of India & Anr. Subject: Challenge to an RBI circular dated 15.11.2022 regarding changes in pension schemes for bank employees. The petitioners argue the circular is arbitrary, violates Article 14 of the Constitution, and adversely affects the vested rights of thousands of retired employees. The matter requires urgent consideration due to the financial hardship faced by pensioners.`
  },
  {
    id: 'LC/DEL/CS/88/2024',
    court: 'Local Court',
    text: `Case Type: Civil Suit (CS). Plaintiff: Ram Lal vs. Defendant: Shyam Builders Pvt. Ltd. Subject: Suit for recovery of possession and mesne profits. The plaintiff, a senior citizen aged 78, alleges that the defendant has illegally occupied his property after the lease agreement expired. The defendant claims an oral agreement for extension, which the plaintiff denies. Evidence stage is ongoing. The plaintiff seeks expedited hearing due to his advanced age and financial dependency on the property's rent.`
  },
  {
    id: 'SC/CrA/901/2024',
    court: 'Supreme Court',
    text: `Case Type: Criminal Appeal. Appellant: State of Haryana vs. Respondent: Mukesh Kumar. Subject: Appeal against the High Court's judgment of acquittal in a murder case under Section 302 IPC. The High Court acquitted the respondent citing inconsistencies in witness testimonies and faulty investigation. The State argues that the High Court overlooked crucial circumstantial evidence, including last seen theory and motive. This case is critical for upholding justice for the victim's family and setting a precedent on evidence appreciation.`
  },
  {
    id: 'HC/MAD/CRLRC/12/2023',
    court: 'High Court',
    text: `Case Type: Criminal Revision Case. Petitioner: S. Selvi vs. Respondent: The State through Inspector of Police. Subject: Revision sought against the framing of charges under the Prevention of Corruption Act. The petitioner, a public servant, alleges that the charges are baseless and initiated with malicious intent. The case file indicates procedural lapses during the initial inquiry. The petitioner's career and reputation are at stake.`
  },
   {
    id: 'LC/PUNE/NI/505/2024',
    court: 'Local Court',
    text: `Case Type: Complaint under Sec 138, Negotiable Instruments Act. Complainant: ABC Financing vs. Accused: Deepak Sharma. Subject: Cheque bounce case for an amount of Rs. 5,00,000. The cheque was issued for repayment of a business loan and was dishonored due to 'insufficient funds'. Multiple notices have been ignored by the accused. The case is one of many such financial recovery suits pending in the district.`
  },
  {
    id: 'SC/CA/3033/2024',
    court: 'Supreme Court',
    text: `Case Type: Civil Appeal. Appellant: Union of India vs. Respondent: Pharma Generics Inc. Subject: Intellectual property dispute concerning the patent validity of a life-saving drug for cancer treatment. The respondent, a foreign pharmaceutical company, holds the patent which the appellant claims is not a novel invention under Section 3(d) of the Patents Act, 1970 and is unaffordable for the general public. The case has wide implications for public health and access to affordable medicines in the country.`
  },
  {
    id: 'HC/KAR/PIL/78/2023',
    court: 'High Court',
    text: `Case Type: Public Interest Litigation (PIL). Petitioner: Green Earth Foundation vs. Respondent: State of Karnataka & Ors. Subject: PIL seeking a halt to construction activities in an ecologically sensitive zone designated as a protected forest area. The petitioner has submitted satellite imagery showing illegal encroachment and deforestation. The respondents claim the development is for a critical public infrastructure project and has all necessary clearances. The case involves a conflict between environmental protection and urban development.`
  },
  {
    id: 'LC/MUM/CC/1120/2024',
    court: 'Local Court',
    text: `Case Type: Consumer Complaint. Complainant: Sunita Patil vs. Opposite Party: E-Shop Online Retailer. Subject: Complaint regarding the delivery of a defective laptop and subsequent refusal to replace or refund the amount. The complainant has provided all communication records and product images. The opposite party argues the defect was caused by customer mishandling. A straightforward case of consumer rights violation under the Consumer Protection Act.`
  },
  {
    id: 'HC/DEL/MATAPP/42/2023',
    court: 'High Court',
    text: `Case Type: Matrimonial Appeal. Appellant: Anjali Sharma vs. Respondent: Rohit Sharma. Subject: Appeal against a family court order denying maintenance to the appellant in a divorce proceeding. The appellant claims the family court failed to properly assess the respondent's income and assets. This case involves sensitive family matters and the interpretation of matrimonial laws regarding spousal support.`
  },
  {
    id: 'SC/WP(C)/55/2024',
    court: 'Supreme Court',
    text: `Case Type: Writ Petition (Civil). Petitioner: Association for Democratic Reforms vs. Respondent: Union of India. Subject: Challenge to the constitutionality of the Electoral Bonds Scheme, alleging it promotes opacity in political funding and violates citizens' Right to Know under Article 19(1)(a). A landmark case concerning transparency in democratic processes.`
  },
  {
    id: 'HC/GAU/BA/101/2024',
    court: 'High Court',
    text: `Case Type: Bail Application. Applicant: Rakesh Das. Subject: Application for bail in a case registered under the NDPS Act. The applicant has been in custody for over two years as an undertrial prisoner. The quantity of contraband is slightly above the commercial quantity, leading to strict bail conditions. The application cites delay in trial as a ground for bail, invoking the right to a speedy trial under Article 21.`
  },
  {
    id: 'LC/BLR/OS/250/2024',
    court: 'Local Court',
    text: `Case Type: Original Suit. Plaintiff: Tech Solutions Pvt. Ltd. vs. Defendant: Innovate Corp. Subject: Suit for infringement of software copyright and damages. The plaintiff alleges that the defendant, an ex-employee, has stolen proprietary source code to start a competing business. The suit seeks an immediate injunction to prevent the defendant from using the code. The case is critical for the plaintiff's business survival.`
  },
  {
    id: 'SC/CONTC/2/2024',
    court: 'Supreme Court',
    text: `Case Type: Contempt Petition. Petitioner: Widows of Manual Scavengers Association vs. Respondent: Chief Secretary, State of Uttar Pradesh. Subject: Petition alleging non-compliance with the Supreme Court's earlier judgment directing the state to provide rehabilitation and compensation to the families of manual scavengers who died during work. The case concerns the enforcement of the court's own orders and the dignity of marginalized communities.`
  },
  {
    id: 'HC/P&H/CWP/12345/2023',
    court: 'High Court',
    text: `Case Type: Civil Writ Petition. Petitioner: Farmers' Union of Punjab vs. Respondent: Food Corporation of India. Subject: Petition challenging the new procurement policies for wheat, which the petitioners claim are detrimental to small and marginal farmers and favor large corporations. The issue could lead to widespread agrarian distress if not addressed promptly.`
  },
  {
    id: 'HC/MUM/POCSO/15/2024',
    court: 'High Court',
    text: `Case Type: Special Case (POCSO). The State of Maharashtra vs. Anil Verma. Subject: Prosecution under Section 4 of the Protection of Children from Sexual Offences (POCSO) Act, 2012. The accused is charged with penetrative sexual assault on a minor aged 9. The trial has been pending, and the victim's family is seeking an expedited hearing. This is a highly sensitive case requiring immediate judicial attention as per statutory mandates.`
  },
  {
    id: 'LC/HYD/MVC/300/2024',
    court: 'Local Court',
    text: `Case Type: Motor Vehicle Claim. Claimant: Mrs. Priya Reddy vs. Respondent: National Insurance Co. Subject: Claim for compensation for the death of her husband in a road accident. The claimant is a widow with two minor children. The case has been pending for 18 months. The primary issue is the quantum of compensation to be awarded.`
  },
  {
    id: 'HC/KOL/ITA/44/2023',
    court: 'High Court',
    text: `Case Type: Income Tax Appeal. Appellant: Megacorp Ltd. vs. Respondent: Commissioner of Income Tax. Subject: Appeal against a high-value tax demand of INR 50 Crores raised by the IT department. The dispute revolves around the interpretation of transfer pricing regulations. The outcome is significant for the company's financial health.`
  }
];


export const fetchAllCases = (): Promise<CaseData[]> => {
  return new Promise((resolve) => {
    // Simulate network delay for fetching the list of cases
    setTimeout(() => {
      resolve(sampleCases);
    }, 1000); // 1 second delay
  });
};

const newCasePool: Omit<CaseData, 'id'>[] = [
    { court: 'Local Court', text: 'Case Type: Civil Suit. Subject: A newly filed suit for a minor property dispute between two neighbors. The case is procedural and at a nascent stage.' },
    { court: 'High Court', text: 'Case Type: Public Interest Litigation. Subject: A new PIL has been filed regarding the contamination of a major river, affecting drinking water for several towns. Urgent intervention is sought.' },
    { court: 'Supreme Court', text: 'Case Type: Special Leave Petition. Subject: SLP filed against a High Court order on a major telecom spectrum allocation policy. Involves significant national revenue implications.'},
    { court: 'Local Court', text: 'Case Type: Bail Application. Subject: Standard bail application for a minor theft case. Accused has no prior criminal record.'},
    { court: 'High Court', text: 'Case Type: Writ Petition. Subject: Petition filed by a group of students challenging the new admission criteria for a state university, citing violation of equality.'}
];

export const fetchNewCases = (): Promise<CaseData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newCases: CaseData[] = [];
            const numToGenerate = Math.floor(Math.random() * 3) + 1; // 1 to 3 new cases

            for (let i = 0; i < numToGenerate; i++) {
                const randomCaseTemplate = newCasePool[Math.floor(Math.random() * newCasePool.length)];
                const newCase: CaseData = {
                    ...randomCaseTemplate,
                    id: `${randomCaseTemplate.court.slice(0,2).toUpperCase()}/RND/${Date.now().toString().slice(-5)}-${i}`,
                };
                newCases.push(newCase);
            }
            resolve(newCases);
        }, 1200);
    });
};
