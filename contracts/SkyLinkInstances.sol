// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SkyLinkPayments.sol";

/**
 * @title SkyLinkInstances
 * @dev A contract that defines data structures and mappings for managing aircraft, components, and service records in the SkyLink Protocol.
 */
contract SkyLinkInstances is SkyLinkPayments {
    /**
     * @dev Passes arguments to parent contract `SkyLinkPayments`.
     * @param _classAFee The fee amount for fee class A.
     * @param _classBFee The fee amount for fee class B.
     * @param _classCFee The fee amount for fee class C.
     */
    constructor(
        uint _classAFee,
        uint _classBFee,
        uint _classCFee
    ) SkyLinkPayments(_classAFee, _classBFee, _classCFee) {}

    /**
     * @dev Struct to represent an aircraft entity in the SkyLink Protocol.
     */
    struct AirCraft {
        address currentOwner; // Address of the current owner.
        address[] previousOwners; // Array of addresses representing previous owners.
        string regNumber; // Registration number of the aircraft.
        string manufacturer; // Manufacturer of the aircraft.
        string model; // Model of the aircraft.
        uint64 productionDate; // Production date of the aircraft.
        uint16 seatCapacity; // Seat capacity of the aircraft.
        bool inService; // Status indicating whether the aircraft is in service.
    }

    /**
     * @dev Struct to represent an aircraft component entity in the SkyLink Protocol.
     */
    struct AirComponent {
        string identifier; // Identifier of the air component.
        string name; // Name of the air component. eg Engine.
        string manufacturer; // Manufacturer of the air component.
        uint64 productionDate; // Production date of the air component.
        bool inService; // Status indicating whether the air component is in service.
    }

    /**
     * @dev Struct to represent a service record entity in the SkyLink Protocol.
     */
    struct ServiceRecord {
        address performer; // Address of the performer (MRO) of the service record.
        uint64 date; // Date of the service record.
        string result; // Result of the service record.
        string description; // Description of the service record.
        string[] servicedComponents; // Array of air component identifiers serviced in the record.
    }

    // Mapping to store aircraft information based on their registration numbers.
    mapping(string => AirCraft) internal regNumberToAircraft;

    // Mapping to associate flight numbers with aircraft entities.
    mapping(string => AirCraft) internal flightNumberToAircraft;

    // Mapping to store service records associated with aircraft registration numbers.
    mapping(string => ServiceRecord[]) internal regNumberToServiceRecords;

    // Mapping to store air components associated with aircraft registration numbers, categorized by service status.
    mapping(string => mapping(bool => AirComponent[]))
        internal regNumberToAirComponents;

    // Mapping to track the existence of component identifiers to enforce uniqueness.
    mapping(string => bool) internal componentIdentifierExists;
}
