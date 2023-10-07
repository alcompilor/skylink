// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SkyLinkAccessControl.sol";

/**
 * @title SkyLinkPayments
 * @dev A contract that manages fees and payments within the SkyLink Protocol.
 */
contract SkyLinkPayments is SkyLinkAccessControl {
    /**
     * @dev Constructs a new `SkyLinkPayments` contract with the specified fees for each fee class.
     * @param _classAFee The fee amount for fee class A.
     * @param _classBFee The fee amount for fee class B.
     * @param _classCFee The fee amount for fee class C.
     */
    constructor(
        uint _classAFee,
        uint _classBFee,
        uint _classCFee
    ) SkyLinkAccessControl() {
        setFee(FeeClass.A, _classAFee);
        setFee(FeeClass.B, _classBFee);
        setFee(FeeClass.C, _classCFee);
    }

    // Enum defining fee classes.
    enum FeeClass {
        A,
        B,
        C
    }

    // Mapping to store fee amounts for each fee class (WEI).
    mapping(FeeClass => uint) private feeHashMap;

    /**
     * @dev Sets the fee amount for a specific fee class.
     * @param _class The fee class to set the fee for.
     * @param _feeAmount The fee amount to set (WEI).
     */
    function setFee(FeeClass _class, uint _feeAmount) public onlySkyLink {
        feeHashMap[_class] = _feeAmount;
    }

    /**
     * @dev Retrieves the fee amount for a specific fee class.
     * @param _class The fee class to query.
     * @return The fee amount for the specified fee class.
     */
    function getFee(FeeClass _class) public view returns (uint) {
        return feeHashMap[_class];
    }

    /**
     * @dev Allows the contract owners to withdraw the contract's balance.
     */
    function withdraw() external onlySkyLink {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Modifiers

    /**
     * @dev Modifier to ensure that a payment is initialized with at least a minimum value.
     * @param _minValue The minimum payment value required.
     */
    modifier initPayment(uint _minValue) {
        require(msg.value >= _minValue);
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
    function deposit()
        external
        payable
        onlySkyLink
        initPayment(getFee(FeeClass.A))
    {}

    function getContractBalance() external view onlySkyLink returns (uint) {
        return address(this).balance;
    }
    *********************/
}
