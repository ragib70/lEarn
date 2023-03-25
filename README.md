# lEarn

## Short Description 

This dapp will allow the users to learn and earn too, as they keep on completing modules in the designated time frame. Try on - https://l-earn-b0931.web.app/

## Youtube Video Link

https://youtu.be/Tgm987ujb9I

## Detailed Description

Detailed Description - The online education scheme currently is you purchase the course, the money goes into the pocket of the instructor, and other than attractive content no incentive to complete the course. There would be many of us who would have taken up an online course and completed a few modules and then left it archived.

While in lEarn, we are incentivizing the learners to get rewarded. Some amount from the course purchase price is allocated to reward the learner for completing course modules in designated time.

Protocol Work Flow

The learner enrolls in the course listed on the lEarn platform by paying the purchase price of the course and the amount gets locked into the contract.

Let's suppose the course price is 100$, and the instructor decides to keep 60% of the course price (60$) as his income and 40% of the course price (40$) to reward the user who completes the course. Assuming 4 modules in the course, then each course is having a reward amount of 10$.

Now as the learner completes Module 1 by the designated deadline, then the instructor has some evaluation process to evaluate the learner's progress and designate him as pass or fail. Currently, we are relying on quizzes, if all the answers are correct the learner will get the reward amount of 10$ for completing each module.

A scenario could be that the learner misses the deadline then he won't get the reward amount, and the 10$ reward will be the income of the instructor. The learner has multiple attempts to get evaluated till the deadline passes.

This way the learner is incentivized to learn and pass the evaluation tests to get the reward on the course. While the instructor gets benefitted from the users who just purchased the course and left it archived, as their reward amount becomes the instructor's income.

## How it's made

The dapp uses the frontend built on react from scratch, with the icons and the components imported from material ui.

The backend and the entire state of the dapp are maintained on the blockchain. The chains on which the dapp's smart contract is deployed are as follows:

1. Fuel Beta 3 Testnet
2. Gnosis (Chiado) Testnet
3. Scroll Alpha Testnet
4. Optimism Testnet
5. Polygon zkEVM Testnet
6. Filecoin Hyperspace Testnet
7. Mantle Testnet.

The current state of each user is stored on-chain which tells about the learner's enrolled courses and the progress for the course. Enrolling and completing the module triggers the amount deducted and deposited from and to the wallet respectively. When the user is enrolled in the course the amount is locked in the contract till the entire course completion deadline for that learner passes or not. Once the deadline has passed then only the rest amount of the course fee after rewarding the learner for module completion gets transferred to the instructor as income.

All the above chains on which the contract is deployed are L2 or rollups which makes the transaction fast and even querying the learner data info.

We also have integrated push chat for support, which helps the learner to get in touch with the instructor and get their doubts resolved, by texting on the push chat popup in the bottom right corner.

Currently, the courses present on the lEarn dapp are static as there is no instructor UI where the instructor can upload the courses and set the reward rules. This is planned for future.

HACK - To be eligible for the optimism track we have only deployed the contract on the optimism mainnet while all the testing has been done on the testnet. So for the mainnet address, there won't be any transaction other than contract creation.

### Gnosis Chain

Deployed Contract Address - https://blockscout.chiadochain.net/address/0x8F47376eFE5CA9f9b9641a093FA71436192484A5

We have deployed the contract on the Gnosis Chiado Testnet, and since it is an innovative dapp which revolutionizes the e-learning market to have higher completion rate.

https://github.com/ragib70/lEarn/blob/bf48fea3b956d01deb4ad035a10714f4145224fd/src/constants/network.ts#L34

### Polygon

Deployed Contract Address - 
https://explorer.public.zkevm-test.net/address/0x8F47376eFE5CA9f9b9641a093FA71436192484A5

It is one of the best dapp deployed on polygon zkEVM testnet which tastes the flavour of fast transaction speeds as being on an L2 chain. Since for each learner, data needs to be updated on the chain it has been quicker on polygon zkEVM.

https://github.com/ragib70/lEarn/blob/bf48fea3b956d01deb4ad035a10714f4145224fd/src/constants/network.ts#L51

### Optimism

Deployed Contract Address - 
Mainnet - https://optimistic.etherscan.io/address/0x9f5bada67d788124e3edacf0c100953ae0e4f6c6
Testnet - 
https://goerli-optimism.etherscan.io/address/0x8f47376efe5ca9f9b9641a093fa71436192484a5

Since the actual money was getting used, we only deployed the dapp on the mainnet, while all the original testing and executions were done on testnet. As was mentioned to be eligible for the prize it is required to be deployed on the optimism mainnet, which we have done.

https://github.com/ragib70/lEarn/blob/bf48fea3b956d01deb4ad035a10714f4145224fd/src/constants/network.ts#L58

### Scroll

Deployed Contract Address - 
https://blockscout.scroll.io/address/0x8F47376eFE5CA9f9b9641a093FA71436192484A5/transactions#address-tabs

Since for each learner, data needs to be updated on the chain it has been quicker on scroll L2. We have deployed the contract on the scroll testnet and have utilized the fast block times and cheaper gas fees to enroll and reward the learners.

https://github.com/ragib70/lEarn/blob/bf48fea3b956d01deb4ad035a10714f4145224fd/src/constants/network.ts#L44

### Filecoin Virtual Machine

Deployed Contract Address - https://hyperspace.filfox.info/en/address/0x3352bDCbdC445aBc5bEBbbec44745968fC038AeC

We have deployed the contract over the filecoin hyperspace network, and have future plans of implementing the interconnectivity of the users using the FVM storage techniques to make the user graph scalable.

https://github.com/ragib70/lEarn/blob/bf48fea3b956d01deb4ad035a10714f4145224fd/src/constants/network.ts#L23

### Fuel Labs

Written the contract in sway and integrated the fuel wallet in the front end to support the users who are willing to use the fuel beta 3 testnet. It is a full stack dapp on fuel supporting fuel wallet and one of the complex contracts written on sway which locks balance and releases as a reward to users. There were a few challenges while writing the contract and executing the function calls but thanks to Sarah and Fuel Labs team for helping us out. 

Sway Contract Code - https://github.com/ragib70/lEarn/blob/fd9ac272fb1e26adf3e64d8496985c6a67594f33/main.sw#L3

https://github.com/ragib70/lEarn/blob/2b3798dda0ca4cf6f8a2dc524cd8709fc88d78d0/src/contexts/network.tsx#L16

### Mantle

Deployed Contract Address - 
https://explorer.testnet.mantle.xyz/address/0x87e940bF5c8FC26ad9F80985D23176D21646423E

We have deployed the contract on the mantle testnet and leveraged it's fast transaction speeds to fetch and store the user states on the chain. This also helped in fast deposit and disbursal of rewards to the user.

https://github.com/ragib70/lEarn/blob/2b3798dda0ca4cf6f8a2dc524cd8709fc88d78d0/src/constants/network.ts#L30

### Push Protocol

In any e-learning website, there is a discussion forum, this is being done here with the help of push chat. Here we have integrated push chat sdk in our d-app which is used to ask questions and doubts from the user to the instructor.

https://github.com/ragib70/lEarn/blob/2b3798dda0ca4cf6f8a2dc524cd8709fc88d78d0/src/components/PushChatSupport.tsx#L5
