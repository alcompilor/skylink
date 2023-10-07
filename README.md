# SkyLink Protocol (SKLP) ✈️

This documentation offers insight into the SkyLink Protocol smart contracts (a framework for managing various aspects of an aircraft management system using blockchain technology). These contracts are designed to oversee functions such as aircraft data management, service record tracking, access control, and payments. They play a pivotal role within the broader SkyLink platform, a concept derived from the SkyLink Protocol Litepaper.

For a deeper understanding of the SkyLink Protocol and its intricate workings, I recommend delving into the Litepaper.

While these contracts have been crafted to support the realization of the SkyLink platform concept, there are currently no intentions for its complete development or deployment. Rather, these smart contracts are provided as an initial step for individuals or entities who wish to delve into or expand upon the SkyLink Protocol concept. Interested parties have the option to embrace these contracts as a cornerstone for crafting their unique aviation-oriented solutions on EVM-compatible blockchains.

## Table of Contents

-   [💡 Introduction](#💡-introduction)
-   [📜 Contracts](#📜-contracts)
-   [🛠️ Testing and Coverage](#🛠️-testing-and-coverage)
-   [🚀 Usage](#🚀-usage)
-   [⚖️ License](#⚖️-license)
-   [👨‍💻 Author](#👨‍💻-author)

## 💡 Introduction

The smart contracts provided in this repository offer a versatile framework for managing various aspects of an aircraft management system using blockchain technology. Below are potential use cases for these smart contracts:

1. **Aircraft Management:** These contracts can be used to create and manage aircraft records. Airlines, aircraft leasing companies, and aviation enthusiasts can utilize this protocol to maintain a comprehensive database of aircraft. Information such as registration numbers, manufacturers, models, production dates, seat capacities, and ownership history can be securely recorded on the blockchain.

2. **Aircraft Component Tracking:** The smart contracts enable the tracking of aircraft components, such as engines, avionics, and more. Maintenance, Repair, and Overhaul (MRO) organizations can employ this system to record component details, including names, identifiers, manufacturers, and production dates. Additionally, the status of these components, whether in service or out of service, can be monitored in real-time.

3. **Ownership and Transfer:** These contracts facilitate the transfer of aircraft ownership. When an aircraft changes hands, the blockchain records the transaction, including the previous and current owners. This feature is valuable for documenting ownership changes accurately and transparently.

4. **Service Records:** Service records for both aircraft and components can be logged on the blockchain. Maintenance service providers (MROs) can use this functionality to create detailed service records, including information about the performer, service date, results, descriptions, and the list of serviced components.

5. **Access Control and Permissions:** The contracts include an access control system that allows the assignment of different roles, such as SUPER, MANUFACTURER, MRO, and THIRD_PARTY. This feature is essential for managing who can interact with the smart contracts and perform specific actions.

6. **Fees and Payments:** The Protocol supports fee management, with different fee classes (A, B, and C) that can be set and modified as needed. Actors can make payments using Ether to access specific features or perform actions within the platform.

Overall, these smart contracts provide a robust foundation for building a blockchain-based aircraft management system. They offer transparency, security, and traceability for various stakeholders within the aviation industry, including airlines, lessors, MROs, and regulatory authorities. Additionally, the contracts can be customized and extended to suit specific business requirements in the aviation sector.

## 📜 Contracts

### 1. SkyLink.sol ♦

**Description:**

The `SkyLink.sol` contract is the primary contract for deploying. It manages aircraft and components within the SkyLink Protocol. It extends the functionality of `SkyLinkAPI.sol` and includes methods for adding aircraft, marking aircraft as in or out of service, exchanging ownership, adding aircraft components, and more.

**Methods:**

-   `constructor(uint _classAFee, uint _classBFee, uint _classCFee)`: Initializes the contract with fee amounts for fee classes A, B, and C.

    -   `_classAFee`: Fee amount for fee class A.
    -   `_classBFee`: Fee amount for fee class B.
    -   `_classCFee`: Fee amount for fee class C.

-   `addAirCraft(...)`: Adds a new aircraft to the protocol.

    -   `regNumber`: Registration number of the aircraft.
    -   `manufacturer`: Manufacturer of the aircraft.
    -   `model`: Model of the aircraft.
    -   `productionDate`: Production date of the aircraft.
    -   `seatCapacity`: Seat capacity of the aircraft.

-   `spawnAirCraft(...)`: Marks an aircraft as in service.

    -   `regNumber`: Registration number of the aircraft.

-   `haltAirCraft(...)`: Marks an aircraft as out of service.

    -   `regNumber`: Registration number of the aircraft.

-   `exchangeAirCraft(...)`: Exchanges the ownership of an aircraft to a new owner.

    -   `regNumber`: Registration number of the aircraft.
    -   `newOwner`: Address of the new owner.

-   `addAirComponent(...)`: Adds a new aircraft component to an aircraft.

    -   `regNumber`: Registration number of the aircraft.
    -   `identifier`: Identifier of the air component.
    -   `name`: Name of the air component (e.g., Engine).
    -   `manufacturer`: Manufacturer of the air component.
    -   `productionDate`: Production date of the air component.

-   `haltAirComponent(...)`: Marks an aircraft component as out of service.

    -   `regNumber`: Registration number of the aircraft.
    -   `identifier`: Identifier of the air component.

-   `assignFlight(...)`: Assigns an aircraft to a flight number.

    -   `regNumber`: Registration number of the aircraft.
    -   `flightNumber`: Flight number to assign.

-   `logServiceRecord(...)`: Logs a service record for an aircraft.

    -   `regNumber`: Registration number of the aircraft.
    -   `date`: Date of the service record.
    -   `result`: Result of the service record.
    -   `description`: Description of the service record.
    -   `servicedComponents`: Array of air component identifiers serviced in the record.

-   `compareStrings(...)`: Compares two strings for equality.

**Inherits From:** `SkyLinkAPI.sol`

**Location:** [SkyLink.sol](contracts/SkyLink.sol)

### 2. SkyLinkAPI.sol ♦

**Description:**

The `SkyLinkAPI.sol` contract provides read-only functions to retrieve information about aircraft and components in the SkyLink Protocol. It is intended for use by third-party services, such as travel aggregators, to access data with proper authorization.

**Methods:**

-   `constructor(uint _classAFee, uint _classBFee, uint _classCFee)`: Initializes the contract with fee amounts for fee classes A, B, and C.

    -   `_classAFee`: Fee amount for fee class A.
    -   `_classBFee`: Fee amount for fee class B.
    -   `_classCFee`: Fee amount for fee class C.

-   `getServiceRecords(...)`: Retrieves the service records for a specific aircraft.

    -   `_reg`: Registration number of the aircraft.

-   `getAirCraftStatus(...)`: Retrieves the status (in service or not) of a specific aircraft.

    -   `_reg`: Registration number of the aircraft.

-   `getAirCraftPrevOwners(...)`: Retrieves the previous owners of a specific aircraft.

    -   `_reg`: Registration number of the aircraft.

-   `getAirCraftCurrentOwner(...)`: Retrieves the current owner of a specific aircraft.

    -   `_reg`: Registration number of the aircraft.

-   `getAirCraftInfo(...)`: Retrieves general information about a specific aircraft.

    -   `_reg`: Registration number of the aircraft.

-   `getActiveAirCraftComponents(...)`: Retrieves active aircraft components associated with a specific aircraft.

    -   `_reg`: Registration number of the aircraft.

-   `getHaltedAirCraftComponents(...)`: Retrieves halted aircraft components associated with a specific aircraft.
    -   `_reg`: Registration number of the aircraft.

**Inherits From:** `SkyLinkInstances.sol`

**Location:** [SkyLinkAPI.sol](contracts/SkyLinkAPI.sol)

### 3. SkyLinkInstances.sol ♦

**Description:**

The `SkyLinkInstances.sol` contract defines data structures and mappings for managing aircraft, components, and service records in the SkyLink Protocol. It includes structures for `AirCraft`, `AirComponent`, and `ServiceRecord`. This contract serves as the foundation for the `SkyLink.sol` and `SkyLinkAPI.sol` contracts in the protocol.

**Structs:**

-   `AirCraft`: Represents an aircraft entity.

    -   `currentOwner`: Address of the current owner.
    -   `previousOwners`: Array of addresses representing previous owners.
    -   `regNumber`: Registration number of the aircraft.
    -   `manufacturer`: Manufacturer of the aircraft.
    -   `model`: Model of the aircraft.
    -   `productionDate`: Production date of the aircraft.
    -   `seatCapacity`: Seat capacity of the aircraft.
    -   `inService`: Status indicating whether the aircraft is in service.

-   `AirComponent`: Represents an aircraft component entity.

    -   `identifier`: Identifier of the air component.
    -   `name`: Name of the air component (e.g., Engine).
    -   `manufacturer`: Manufacturer of the air component.
    -   `productionDate`: Production date of the air component.
    -   `inService`: Status indicating whether the air component is in service.

-   `ServiceRecord`: Represents a service record entity.
    -   `performer`: Address of the performer (MRO) of the service record.
    -   `date`: Date of the service record.
    -   `result`: Result of the service record.
    -   `description`: Description of the service record.
    -   `servicedComponents`: Array of air component identifiers serviced in the record.

**Mappings:**

-   `regNumberToAircraft`: Stores aircraft information based on registration numbers.
-   `flightNumberToAircraft`: Associates flight numbers with aircraft entities.
-   `regNumberToServiceRecords`: Stores service records associated with aircraft registration numbers.
-   `regNumberToAirComponents`: Stores aircraft components categorized by service status.
-   `componentIdentifierExists`: Tracks the existence of component identifiers.

**Inherits From:** `SkyLinkPayments.sol`

**Location:** [SkyLinkInstances.sol](contracts/SkyLinkInstances.sol)

### 4. SkyLinkPayments.sol ♦

**Description:**

The `SkyLinkPayments.sol` contract manages fees and payments within the SkyLink Protocol. It allows setting fees for different fee classes, withdrawing contract balances, and includes modifiers to ensure payment initialization and access control.

**Enums:**

-   `FeeClass`: Defines fee classes (A, B, C).

**Mappings:**

-   `feeHashMap`: Stores fee amounts for each fee class (in WEI).

**Methods:**

-   `constructor(uint _classAFee, uint _classBFee, uint _classCFee)`: Initializes the contract with fee amounts for fee classes A, B, and C.

    -   `_classAFee`: Fee amount for fee class A.
    -   `_classBFee`: Fee amount for fee class B.
    -   `_classCFee`: Fee amount for fee class C.

-   `setFee(...)`: Sets the fee amount for a specific fee class.

    -   `_class`: Fee class to set the fee for.
    -   `_feeAmount`: Fee amount to set (WEI).

-   `getFee(...)`: Retrieves the fee amount for a specific fee class.

    -   `_class`: Fee class to query.

-   `withdraw()`: Allows the contract owners to withdraw the contract's balance.

**Inherits From:** `SkyLinkAccessControl.sol`

**Location:** [SkyLinkPayments.sol](contracts/SkyLinkPayments.sol)

### 5. SkyLinkAccessControl.sol ♦

**Description:**

The `SkyLinkAccessControl.sol` contract manages access control and permissions for various roles within the SkyLink Protocol. It includes methods to grant and revoke access roles, vote for revoking a Root Owner, and check permissions.

**Enums:**

-   `AccessRoles`: Defines access roles (SUPER, MANUFACTURER, MRO, THIRD_PARTY).

**Mappings:**

-   `permission`: Stores permissions for each address and role.
-   `consensus`: Tracks consensus on specific actions.
-   `performerAddressToName`: Associates performer addresses (MROs) with their names.
-   `hasVoted`: Tracks addresses that have voted in consensus decisions.

**Methods:**

-   `constructor()`: Initializes the contract, and the deployer becomes the root owner with SUPER access.

-   `addSkyLink(...)`: Grants SUPER access to a SkyLink address.

-   `revokeSkyLink(...)`: Revokes SUPER access from a SkyLink address.

-   `voteToRevokeRootOwner()`: Votes to revoke the root owner's access.

-   `revokeRootOwner(...)`: Revokes the root owner's access if consensus is reached.

-   `addManufacturer(...)`: Grants MANUFACTURER access to an address.

-   `revokeManufacturer(...)`: Revokes MANUFACTURER access from an address.

-   `addMRO(...)`: Grants MRO access to an address and associates a name with it.

-   `revokeMRO(...)`: Revokes MRO access from an address.

-   `addThirdParty(...)`: Grants THIRD_PARTY access to an address.

-   `revokeThirdParty(...)`: Revokes THIRD_PARTY access from an address.

**Modifiers:**

-   `notRootOwner(...)`: Ensures an address is not the root owner.
-   `onlySkyLink()`: Restricts access to only the SUPER role.
-   `alsoManufacturer()`: Restricts access to SUPER and MANUFACTURER roles.
-   `alsoMRO()`: Restricts access to SUPER, MANUFACTURER, and MRO roles.
-   `alsoThirdParty()`: Restricts access to SUPER, MANUFACTURER, MRO, and THIRD_PARTY roles.
-   `onlyOneVote()`: Ensures an address has not voted in consensus.
-   `checkConsensus(...)`: Checks consensus for specific actions.

**Location:** [SkyLinkAccessControl.sol](contracts/SkyLinkAccessControl.sol)

## 🛠️ Testing and Coverage

These contracts have undergone unit testing, with 100% coverage. You can locate the unit tests in the "test" directory. To execute the tests, please make sure you have the necessary npm packages installed by running `npm install`. Additionally, uncomment any functions meant for testing within the contracts (note that some contracts include a testing section).

Finally, utilize the following commands:

-   Run tests: `npx hardhat test`
-   Generate coverage reports: `npx hardhat coverage`

Coverage reports can be analyzed to assess the effectiveness and completeness of the unit tests.

## 🚀 Usage

The contracts provided in this repository are designed for deployment using a framework of your choice or the Remix IDE. It's recommended to start with `SkyLink.sol` as your deployment base.

These contracts are provided as a conceptual starting point for blockchain-based solutions related to aviation and aircraft management. There are no plans for the full development or implementation of the SkyLink platform. Instead, these contracts are open for exploration and adoption by individuals or organizations interested in leveraging them to create their own aviation-related blockchain solutions.

**NOTE:** Contracts in this repository are provided for educational and experimental purposes only. Use caution when employing the code in a production environment, and ensure that it undergoes a comprehensive audit.

## ⚖️ License

This project is licensed under the MIT License.

## 👨‍💻 Author

[@Ahmed Abbasi](https://www.github.com/bigcbull)
