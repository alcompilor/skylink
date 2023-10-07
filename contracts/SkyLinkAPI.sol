// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./SkyLinkInstances.sol";

/**
 * @title SkyLinkAPI
 * @dev A contract that provides read-only functions to retrieve information about aircraft and components in the SkyLink Protocol.
 * Third-party services, such as travel aggregators, can use this API to access the data.
 * Access to this data is supposed to be restricted to authorized parties who have been issued API keys by SkyLink Platform.
 */
contract SkyLinkAPI is SkyLinkInstances {
    /**
     * @dev Passes arguments to parent contract `SkyLinkInstances`.
     * @param _classAFee The fee amount for fee class A.
     * @param _classBFee The fee amount for fee class B.
     * @param _classCFee The fee amount for fee class C.
     */
    constructor(
        uint _classAFee,
        uint _classBFee,
        uint _classCFee
    ) SkyLinkInstances(_classAFee, _classBFee, _classCFee) {}

    /**
     * @dev Retrieves the service records for a specific aircraft.
     * @param _reg The registration number of the aircraft.
     * @return An array of service records associated with the aircraft.
     */
    function getServiceRecords(
        string calldata _reg
    ) external view onlySkyLink returns (ServiceRecord[] memory) {
        return regNumberToServiceRecords[_reg];
    }

    /**
     * @dev Retrieves the status (in service or not) of a specific aircraft.
     * @param _reg The registration number of the aircraft.
     * @return True if the aircraft is in service, false otherwise.
     */
    function getAirCraftStatus(
        string calldata _reg
    ) external view onlySkyLink returns (bool) {
        return regNumberToAircraft[_reg].inService;
    }

    /**
     * @dev Retrieves the previous owners of a specific aircraft.
     * @param _reg The registration number of the aircraft.
     * @return An array of addresses representing previous owners.
     */
    function getAirCraftPrevOwners(
        string calldata _reg
    ) external view onlySkyLink returns (address[] memory) {
        return regNumberToAircraft[_reg].previousOwners;
    }

    /**
     * @dev Retrieves the current owner of a specific aircraft.
     * @param _reg The registration number of the aircraft.
     * @return The address of the current owner.
     */
    function getAirCraftCurrentOwner(
        string calldata _reg
    ) external view onlySkyLink returns (address) {
        return regNumberToAircraft[_reg].currentOwner;
    }

    /**
     * @dev Retrieves general information about a specific aircraft.
     * @param _reg The registration number of the aircraft.
     * @return An array containing aircraft information: [manufacturer, model, productionDate, seatCapacity].
     */
    function getAirCraftInfo(
        string calldata _reg
    ) external view onlySkyLink returns (string[4] memory) {
        AirCraft memory aircraft = regNumberToAircraft[_reg];
        string[4] memory info = [
            aircraft.manufacturer,
            aircraft.model,
            Strings.toString(aircraft.productionDate),
            Strings.toString(aircraft.seatCapacity)
        ];
        return info;
    }

    /**
     * @dev Retrieves active air components associated with a specific aircraft.
     * @param _reg The registration number of the aircraft.
     * @return An array of active AirComponent structs.
     */
    function getActiveAirCraftComponents(
        string calldata _reg
    ) external view onlySkyLink returns (AirComponent[] memory) {
        return regNumberToAirComponents[_reg][true];
    }

    /**
     * @dev Retrieves halted air components associated with a specific aircraft.
     * @param _reg The registration number of the aircraft.
     * @return An array of halted AirComponent structs.
     */
    function getHaltedAirCraftComponents(
        string calldata _reg
    ) external view onlySkyLink returns (AirComponent[] memory) {
        return regNumberToAirComponents[_reg][false];
    }
}
