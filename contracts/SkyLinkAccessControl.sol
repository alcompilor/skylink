// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title SkyLinkAccessControl
 * @dev A contract that manages access control and permissions for various roles within the SkyLink Protocol.
 */
contract SkyLinkAccessControl {
    /**
     * @dev Constructor to initialize the SkyLinkAccessControl contract.
     * The deployer of the contract becomes the root owner with SUPER access.
     */
    constructor() {
        rootOwner = msg.sender;
        permission[msg.sender][AccessRoles.SUPER] = true;
    }

    address private rootOwner; // Address of the root owner.

    // Constant for revoking root owner access.
    string constant REVOKE_ROOT = "revokeRoot";

    // Enum defining access roles.
    enum AccessRoles {
        SUPER,
        MANUFACTURER,
        MRO,
        THIRD_PARTY
    }

    // Mapping to store permissions for each address and role.
    mapping(address => mapping(AccessRoles => bool)) internal permission;

    // Mapping to track consensus on specific actions.
    mapping(string => uint8) internal consensus;

    // Mapping to associate performer addresses (MROs) with their names.
    mapping(address => string) internal performerAddressToName;

    // Mapping to track addresses that have voted in consensus decisions.
    mapping(address => bool) internal hasVoted;
    address[] private votedAddresses;

    /**
     * @dev Grants SUPER access to a SkyLink address.
     * @param _skyLinkAddress The address to grant SUPER access.
     */
    function addSkyLink(address _skyLinkAddress) external onlySkyLink {
        permission[_skyLinkAddress][AccessRoles.SUPER] = true;
    }

    /**
     * @dev Revokes SUPER access from a SkyLink address.
     * @param _skyLinkAddress The address to revoke SUPER access.
     */
    function revokeSkyLink(
        address _skyLinkAddress
    ) external onlySkyLink notRootOwner(_skyLinkAddress) {
        permission[_skyLinkAddress][AccessRoles.SUPER] = false;
    }

    /**
     * @dev Votes to revoke the root owner's access.
     * Each address can vote only once.
     */
    function voteToRevokeRootOwner() external onlySkyLink onlyOneVote {
        consensus[REVOKE_ROOT]++;
        hasVoted[msg.sender] = true;
        votedAddresses.push(msg.sender);
    }

    /**
     * @dev Revokes the root owner's access if consensus is reached.
     * @param _newRootOwner The address of the new root owner.
     */
    function revokeRootOwner(
        address _newRootOwner
    ) external onlySkyLink checkConsensus(REVOKE_ROOT, 5) {
        rootOwner = _newRootOwner;
        consensus[REVOKE_ROOT] = 0;
        for (uint i = 0; i < votedAddresses.length; i++) {
            delete hasVoted[votedAddresses[i]];
        }
        delete votedAddresses;
    }

    /**
     * @dev Grants MANUFACTURER access to an address.
     * @param _manuAddress The address to grant MANUFACTURER access.
     */
    function addManufacturer(address _manuAddress) external onlySkyLink {
        permission[_manuAddress][AccessRoles.MANUFACTURER] = true;
    }

    /**
     * @dev Revokes MANUFACTURER access from an address.
     * @param _manuAddress The address to revoke MANUFACTURER access.
     */
    function revokeManufacturer(address _manuAddress) external onlySkyLink {
        delete permission[_manuAddress][AccessRoles.MANUFACTURER];
    }

    /**
     * @dev Grants MRO access to an address and associates a name with it.
     * @param _MROAddress The address to grant MRO access.
     * @param _MROName The name of the MRO.
     */
    function addMRO(
        address _MROAddress,
        string calldata _MROName
    ) external alsoManufacturer {
        permission[_MROAddress][AccessRoles.MRO] = true;
        performerAddressToName[_MROAddress] = _MROName;
    }

    /**
     * @dev Revokes MRO access from an address.
     * @param _MROAddress The address to revoke MRO access.
     */
    function revokeMRO(address _MROAddress) external alsoManufacturer {
        delete permission[_MROAddress][AccessRoles.MRO];
    }

    /**
     * @dev Grants THIRD_PARTY access to an address.
     * @param _thirdPAddress The address to grant THIRD_PARTY access.
     */
    function addThirdParty(address _thirdPAddress) external onlySkyLink {
        permission[_thirdPAddress][AccessRoles.THIRD_PARTY] = true;
    }

    /**
     * @dev Revokes THIRD_PARTY access from an address.
     * @param _thirdPAddress The address to revoke THIRD_PARTY access.
     */
    function revokeThirdParty(address _thirdPAddress) external onlySkyLink {
        delete permission[_thirdPAddress][AccessRoles.THIRD_PARTY];
    }

    // Modifiers

    // Modifier to ensure an address is not the root owner.
    modifier notRootOwner(address _skyLinkAddress) {
        require(_skyLinkAddress != rootOwner);
        _;
    }

    // Modifier to restrict access to only the SUPER role.
    modifier onlySkyLink() {
        require(permission[msg.sender][AccessRoles.SUPER] == true);
        _;
    }

    // Modifier to restrict access to SUPER and MANUFACTURER roles.
    modifier alsoManufacturer() {
        require(
            permission[msg.sender][AccessRoles.SUPER] == true ||
                permission[msg.sender][AccessRoles.MANUFACTURER] == true
        );
        _;
    }

    // Modifier to restrict access to SUPER, MANUFACTURER, and MRO roles.
    modifier alsoMRO() {
        require(
            permission[msg.sender][AccessRoles.SUPER] == true ||
                permission[msg.sender][AccessRoles.MANUFACTURER] == true ||
                permission[msg.sender][AccessRoles.MRO] == true
        );
        _;
    }

    // Modifier to restrict access to SUPER, MANUFACTURER, MRO, and THIRD_PARTY roles.
    modifier alsoThirdParty() {
        require(
            permission[msg.sender][AccessRoles.SUPER] == true ||
                permission[msg.sender][AccessRoles.MANUFACTURER] == true ||
                permission[msg.sender][AccessRoles.MRO] == true ||
                permission[msg.sender][AccessRoles.THIRD_PARTY] == true
        );
        _;
    }

    // Modifier to ensure an address has not voted in consensus.
    modifier onlyOneVote() {
        require(hasVoted[msg.sender] == false);
        _;
    }

    // Modifier to check consensus for specific actions.
    modifier checkConsensus(string memory _type, uint8 _mass) {
        require(consensus[_type] >= _mass);
        _;
    }

    // ────────────────────────────────────────────────────────────────────────
    // │                                                                         │
    // │                             TESTING SECTION                             │
    // │                                                                         │
    // ────────────────────────────────────────────────────────────────────────
    // This section contains functions that are used for testing purposes only.
    // These functions should NEVER be used in production code!
    // These functions should be uncommented before running HardHat unit tests.

    /*********************
    function hasPermission(
        address _address,
        AccessRoles _role
    ) external view onlySkyLink returns (bool) {
        return permission[_address][_role];
    }

    function getArrayLength() external view onlySkyLink returns (uint) {
        return votedAddresses.length;
    }

    function tryMRO() external view alsoMRO {}

    function tryManufacturer() external view alsoManufacturer {}

    function tryThirdParty() external view alsoThirdParty {}
    ********************/
}
