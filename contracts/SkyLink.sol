// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SkyLinkAPI.sol";

/**
 * @title
 *
 *  .d8888b.  888               888      d8b          888
 * d88P  Y88b 888               888      Y8P          888
 * Y88b.      888               888                   888
 *  "Y888b.   888  888 888  888 888      888 88888b.  888  888
 *     "Y88b. 888 .88P 888  888 888      888 888 "88b 888 .88P
 *       "888 888888K  888  888 888      888 888  888 888888K
 * Y88b  d88P 888 "88b Y88b 888 888      888 888  888 888 "88b
 *  "Y8888P"  888  888  "Y88888 88888888 888 888  888 888  888
 *                          888
 *                     Y8b d88P
 *                      "Y88P"
 *
 * @dev This contract is the primary contract intended for deployment and it manages aircraft and components for SkyLink Protocol.
 * @notice Developed by Ahmed Abbasi | https://github.com/bigcbull/skylink
 * @notice FOR EDUCATIONAL OR EXPERIMENTAL PURPOSES ONLY.
 * Please refrain from employing the code in a production environment unless it has undergone a comprehensive audit.
 * As the developer, I bear no responsibility for any damage that may arise from the misuse of this Solidity code.
 */

contract SkyLink is SkyLinkAPI {
    /**
     * @dev Passes arguments to parent contract `SkyLinkAPI`.
     * @param _classAFee The fee amount for fee class A.
     * @param _classBFee The fee amount for fee class B.
     * @param _classCFee The fee amount for fee class C.
     */
    constructor(
        uint _classAFee,
        uint _classBFee,
        uint _classCFee
    ) SkyLinkAPI(_classAFee, _classBFee, _classCFee) {}

    /**
     * @dev Adds a new aircraft to the protocol.
     * @param _regNumber The registration number of the aircraft.
     * @param _manufacturer The manufacturer of the aircraft.
     * @param _model The model of the aircraft.
     * @param _productionDate The production date of the aircraft.
     * @param _seatCapacity The seat capacity of the aircraft.
     * @param _currentOwner The current owner's address.
     */
    function addAirCraft(
        string calldata _regNumber,
        string calldata _manufacturer,
        string calldata _model,
        uint64 _productionDate,
        uint16 _seatCapacity,
        address _currentOwner
    ) external payable alsoManufacturer initPayment(getFee(FeeClass.A)) {
        regNumberToAircraft[_regNumber] = AirCraft({
            regNumber: _regNumber,
            manufacturer: _manufacturer,
            model: _model,
            seatCapacity: _seatCapacity,
            currentOwner: _currentOwner,
            productionDate: _productionDate,
            previousOwners: new address[](0),
            inService: false
        });
    }

    /**
     * @dev Marks an aircraft as in service.
     * @param _regNumber The registration number of the aircraft.
     */
    function spawnAirCraft(
        string calldata _regNumber
    )
        external
        payable
        alsoManufacturer
        requireComponents(_regNumber)
        initPayment(getFee(FeeClass.B))
    {
        regNumberToAircraft[_regNumber].inService = true;
    }

    /**
     * @dev Marks an aircraft as out of service.
     * @param _regNumber The registration number of the aircraft.
     */
    function haltAirCraft(
        string calldata _regNumber
    ) external payable alsoManufacturer initPayment(getFee(FeeClass.B)) {
        regNumberToAircraft[_regNumber].inService = false;
    }

    /**
     * @dev Exchanges the ownership of an aircraft to a new owner.
     * @param _reg The registration number of the aircraft.
     * @param _newOwner The address of the new owner.
     */
    function exchangeAirCraft(
        string calldata _reg,
        address _newOwner
    ) external payable onlyOwner(_reg) initPayment(getFee(FeeClass.A)) {
        regNumberToAircraft[_reg].previousOwners.push(msg.sender);
        regNumberToAircraft[_reg].currentOwner = _newOwner;
    }

    /**
     * @dev Adds a new aircraft component to an aircraft.
     * @param _reg The registration number of the aircraft.
     * @param _name The name of the air component.
     * @param _identifier The identifier of the air component.
     * @param _manufacturer The manufacturer of the air component.
     * @param _productionDate The production date of the air component.
     */
    function addAirComponent(
        string calldata _reg,
        string calldata _name,
        string calldata _identifier,
        string calldata _manufacturer,
        uint64 _productionDate
    )
        external
        payable
        alsoManufacturer
        isBelowComponentLimit(_reg)
        uniqueIdentifier(_identifier)
        initPayment(getFee(FeeClass.A))
    {
        regNumberToAirComponents[_reg][true].push(
            AirComponent({
                name: _name,
                identifier: _identifier,
                manufacturer: _manufacturer,
                productionDate: _productionDate,
                inService: true
            })
        );
        componentIdentifierExists[_identifier] = true;
    }

    /**
     * @dev Marks an aircraft component as out of service.
     * @param _identifier The identifier of the air component.
     * @param _reg The registration number of the aircraft.
     */
    function haltAirComponent(
        string calldata _identifier,
        string calldata _reg
    ) external payable alsoMRO initPayment(getFee(FeeClass.B)) {
        uint componentsLength = regNumberToAirComponents[_reg][true].length;
        for (uint i = 0; i < componentsLength; i++) {
            AirComponent memory component = regNumberToAirComponents[_reg][
                true
            ][i];
            if (compareStrings(component.identifier, _identifier)) {
                component.inService = false;
                regNumberToAirComponents[_reg][false].push(component);
                delete regNumberToAirComponents[_reg][true][i];
                break;
            }
        }
    }

    /**
     * @dev Assigns an aircraft to a flight number.
     * @param _flightNumber The flight number.
     * @param _regNumber The registration number of the aircraft.
     */
    function assignFlight(
        string calldata _flightNumber,
        string calldata _regNumber
    ) external alsoThirdParty {
        flightNumberToAircraft[_flightNumber] = regNumberToAircraft[_regNumber];
    }

    /**
     * @dev Logs a service record for an aircraft.
     * @param _reg The registration number of the aircraft.
     * @param _performer The address of the performer (MRO).
     * @param _date The date of the service record.
     * @param _result The result of the service record.
     * @param _description The description of the service record.
     * @param _servicedComponents The list of serviced components.
     */
    function logServiceRecord(
        string calldata _reg,
        address _performer,
        uint64 _date,
        string calldata _result,
        string calldata _description,
        string[] calldata _servicedComponents
    ) external payable alsoMRO initPayment(getFee(FeeClass.B)) {
        regNumberToServiceRecords[_reg].push(
            ServiceRecord({
                performer: _performer,
                date: _date,
                result: _result,
                description: _description,
                servicedComponents: _servicedComponents
            })
        );
    }

    /**
     * @dev Compares two strings for equality.
     * @param _a The first string.
     * @param _b The second string.
     * @return True if the strings are equal, false otherwise.
     */
    function compareStrings(
        string memory _a,
        string memory _b
    ) public pure returns (bool) {
        return (keccak256(abi.encodePacked((_a))) ==
            keccak256(abi.encodePacked((_b))));
    }

    // Modifiers

    /**
     * @dev Modifier that requires the number of air components in aircraft to be above a certain threshold.
     * @param _reg The registration number of the aircraft.
     */
    modifier requireComponents(string calldata _reg) {
        require(regNumberToAirComponents[_reg][true].length > 3);
        _;
    }

    /**
     * @dev Modifier that checks if the number of air components in aircraft is below a certain limit.
     * @param _reg The registration number of the aircraft.
     */
    modifier isBelowComponentLimit(string calldata _reg) {
        require(regNumberToAirComponents[_reg][true].length < 20);
        _;
    }

    /**
     * @dev Modifier that ensures the identifier of the air component is unique.
     * @param _identifier The identifier of the air component.
     */
    modifier uniqueIdentifier(string calldata _identifier) {
        require(componentIdentifierExists[_identifier] == false);
        _;
    }

    /**
     * @dev Modifier that restricts access to the owner of the aircraft.
     * @param _reg The registration number of the aircraft.
     */
    modifier onlyOwner(string calldata _reg) {
        require(regNumberToAircraft[_reg].currentOwner == msg.sender);
        _;
    }
}
