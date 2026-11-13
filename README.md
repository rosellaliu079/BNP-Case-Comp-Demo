This was created for the 2026 PMC x BNP Paribas Case competition.

We were prompted to create a solution to solve the issue that Relationship Managers (RMs) Face: When sitting on an aggregate amount of data, how do we use the data and turn it into actionable insight. Essentially about getting the right information to the right client at the right time

# Rendez-vous

**This Week in a Changing World:** a weekly brief that helps relationship managers know which client to call, about what, and why now.

🔗 **Live demo:** (https://bnp-case-comp-demo.vercel.app/)

## Run locally
```bash
git clone [https://github.com/rosellaliu079/rendez-vous.git](https://github.com/rosellaliu079/BNP-Case-Comp-Demo.git)
cd rendez-vous
npm install
npm run dev
```

## What it does
Rendez-vous is a centralized weekly brief that sits inside the tools RMs already use (Outlook and the CRM) and delivers 3-5 items variably, built from two workflows:

- **Market-triggered:** links a market, industry or regulatory development to a specific client's context and the bank's relationship with them.
- **Déjà Due:** surfaces follow-ups and follow-on deals at the right time, based on rules the RM sets. This helps with bringing in future deal flow for the bank and strengthens the client relationship. E.g. for a client that has a credit facility maturing, deja-due can remind the RM 18 months later to discuss amend-and-extend or refinancing, helping centralize reminders and bringing in future deal flow.

Every item links to its sources. Nothing reaches a client without the RM reviewing it. Developed as an internal use tool only

## Demo walkthrough
Have 3 examples of possible clients to call based off recent market triggers. Feel free to click around, prototype is interactable. Open the demo to see how Rendez-vous flags a client, why and help prepare the conversation. 

## Notes
All client data is synthetic and for demonstration only. 

Built for the PMC Case Competition 2026. If developed into a real product, would not have synthetic data and instead reference API calls to sync to backend of CRM data, building centralized workflow integration into outlook, existing client/meeting notes, and CRM data. The intent is for AI to use RAG, by retrieving external and internal data before generating responses. Everything is linked to sources, meant as a tool to aid the RM to make decisions.

