import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SkyLink Access Control Contract Testing", () => {
    async function deploySkyLink() {
        const SkyLink = await ethers.getContractFactory("SkyLink");
        const SkyLinkContract = await SkyLink.deploy(1, 1, 1);
        const [owner, addr1, addr2, addr3, addr4, addr5] =
            await ethers.getSigners();
        await SkyLinkContract.waitForDeployment();
        return { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 };
    }
    it("Should give Root Owner SUPER access", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        expect(await SkyLinkContract.hasPermission(owner, 0)).to.equal(true);
    });
    it("Should NOT allow Root Owner to revoke its own access", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await expect(SkyLinkContract.revokeSkyLink(owner)).to.be.reverted;
    });
    it("Should allow Root Owner / SUPER to Add All Types of Access Roles", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await expect(SkyLinkContract.addManufacturer(addr1)).to.not.be.reverted;
        await expect(SkyLinkContract.addSkyLink(addr2)).to.not.be.reverted;
        await expect(SkyLinkContract.addMRO(addr3, "MRO Example")).to.not.be
            .reverted;
        await expect(SkyLinkContract.addThirdParty(addr4)).to.not.be.reverted;
        expect(await SkyLinkContract.hasPermission(addr1, 1)).to.equal(true);
    });
    it("Should allow Root Owner / SUPER to Revoke All Types of Access Roles", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addManufacturer(addr1);
        await SkyLinkContract.addSkyLink(addr2);
        await SkyLinkContract.addMRO(addr3, "MRO Example");
        await SkyLinkContract.addThirdParty(addr4);
        await expect(SkyLinkContract.revokeManufacturer(addr1)).to.not.be
            .reverted;
        await expect(SkyLinkContract.revokeSkyLink(addr2)).to.not.be.reverted;
        await expect(SkyLinkContract.revokeMRO(addr3)).to.not.be.reverted;
        await expect(SkyLinkContract.revokeThirdParty(addr4)).to.not.be
            .reverted;
    });
    it("Should NOT allow MANUFACTURER Role to add or revoke SUPER role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addManufacturer(addr1);
        await expect(SkyLinkContract.connect(addr1).revokeSkyLink(owner)).to.be
            .reverted;
        await expect(SkyLinkContract.connect(addr1).addSkyLink(addr1)).to.be
            .reverted;
    });
    it("Should NOT allow MANUFACTURER Role to add or revoke THIRD_PARTY role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addManufacturer(addr1);
        await expect(SkyLinkContract.connect(addr1).addThirdParty(addr2)).to.be
            .reverted;
        await expect(SkyLinkContract.connect(addr1).revokeThirdParty(addr2)).to
            .be.reverted;
    });
    it("Should NOT allow MANUFACTURER Role to add or revoke MANUFACTURER role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addManufacturer(addr1);
        await expect(SkyLinkContract.connect(addr1).addManufacturer(addr2)).to
            .be.reverted;
        await expect(SkyLinkContract.connect(addr1).revokeManufacturer(addr2))
            .to.be.reverted;
    });
    it("Should allow MANUFACTURER Role to add or revoke MRO role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addManufacturer(addr1);
        await expect(
            SkyLinkContract.connect(addr1).addMRO(addr2, "MRO Testing")
        ).to.not.be.reverted;
        await expect(SkyLinkContract.connect(addr1).revokeMRO(addr2)).to.not.be
            .reverted;
    });
    it("Should NOT allow MRO Role to add or revoke SUPER role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addMRO(addr1, "MRO Test");
        await expect(SkyLinkContract.connect(addr1).revokeSkyLink(owner)).to.be
            .reverted;
        await expect(SkyLinkContract.connect(addr1).addSkyLink(addr1)).to.be
            .reverted;
    });
    it("Should NOT allow MRO Role to add or revoke MANUFACTURER role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addMRO(addr1, "MRO Test");
        await expect(SkyLinkContract.connect(addr1).addManufacturer(addr2)).to
            .be.reverted;
        await expect(SkyLinkContract.connect(addr1).revokeManufacturer(addr2))
            .to.be.reverted;
    });
    it("Should NOT allow MRO Role to add or revoke MRO role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addMRO(addr1, "MRO Test");
        await expect(SkyLinkContract.connect(addr1).addMRO(addr2, "MRO Test"))
            .to.be.reverted;
        await expect(SkyLinkContract.connect(addr1).revokeMRO(addr2)).to.be
            .reverted;
    });
    it("Should NOT allow MRO Role to add or revoke THIRD_PARTY role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addMRO(addr1, "MRO Test");
        await expect(SkyLinkContract.connect(addr1).addThirdParty(addr2)).to.be
            .reverted;
        await expect(SkyLinkContract.connect(addr1).revokeThirdParty(addr2)).to
            .be.reverted;
    });
    it("Should NOT allow THIRD_PARTY Role to add or revoke SUPER role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addThirdParty(addr1);
        await expect(SkyLinkContract.connect(addr1).revokeSkyLink(owner)).to.be
            .reverted;
        await expect(SkyLinkContract.connect(addr1).addSkyLink(addr1)).to.be
            .reverted;
    });
    it("Should NOT allow THIRD_PARTY Role to add or revoke MANUFACTURER role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addThirdParty(addr1);
        await expect(SkyLinkContract.connect(addr1).addManufacturer(addr1)).to
            .be.reverted;
        await expect(SkyLinkContract.connect(addr1).revokeManufacturer(addr1))
            .to.be.reverted;
    });
    it("Should NOT allow THIRD_PARTY Role to add or revoke MRO role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addThirdParty(addr1);
        await expect(
            SkyLinkContract.connect(addr1).addMRO(addr1, "MRO Testing")
        ).to.be.reverted;
        await expect(SkyLinkContract.connect(addr1).revokeMRO(addr1)).to.be
            .reverted;
    });
    it("Should NOT allow THIRD_PARTY Role to add or revoke THIRD_PARTY role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addThirdParty(addr1);
        await expect(SkyLinkContract.connect(addr1).addThirdParty(addr2)).to.be
            .reverted;
        await expect(SkyLinkContract.connect(addr1).revokeThirdParty(addr2)).to
            .be.reverted;
    });
    it("Should NOT allow more than one vote for same address", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addSkyLink(addr1);
        await expect(SkyLinkContract.connect(addr1).voteToRevokeRootOwner()).to
            .not.be.reverted;
        await expect(SkyLinkContract.connect(addr1).voteToRevokeRootOwner()).to
            .be.reverted;
    });
    it("Should NOT revoke Root Owner (NO CONSENSUS)", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addSkyLink(addr1);
        await SkyLinkContract.addSkyLink(addr2);
        await SkyLinkContract.addSkyLink(addr3);
        await SkyLinkContract.addSkyLink(addr4);
        await SkyLinkContract.connect(addr1).voteToRevokeRootOwner();
        await SkyLinkContract.connect(addr2).voteToRevokeRootOwner();
        await SkyLinkContract.connect(addr3).voteToRevokeRootOwner();
        await SkyLinkContract.connect(addr4).voteToRevokeRootOwner();
        await expect(SkyLinkContract.connect(addr3).revokeRootOwner(addr3)).to
            .be.reverted;
    });
    it("Should revoke Root Owner (CONSENSUS) + Reset hasVoted/addressArray", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addSkyLink(addr1);
        await SkyLinkContract.addSkyLink(addr2);
        await SkyLinkContract.addSkyLink(addr3);
        await SkyLinkContract.addSkyLink(addr4);
        await SkyLinkContract.addSkyLink(addr5);
        await SkyLinkContract.connect(addr1).voteToRevokeRootOwner();
        await SkyLinkContract.connect(addr2).voteToRevokeRootOwner();
        await SkyLinkContract.connect(addr3).voteToRevokeRootOwner();
        await SkyLinkContract.connect(addr4).voteToRevokeRootOwner();
        await SkyLinkContract.connect(addr5).voteToRevokeRootOwner();
        await expect(SkyLinkContract.connect(addr3).revokeRootOwner(addr3)).to
            .not.be.reverted;
        // test if addressArray and hasVoted map has been reset
        expect(await SkyLinkContract.connect(addr4).getArrayLength()).to.equal(
            0
        );
        await expect(SkyLinkContract.connect(addr2).voteToRevokeRootOwner()).to
            .not.be.reverted;
    });
    it("Should test whether alsoMRO modifier is working as expected", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 } =
            await loadFixture(deploySkyLink);
        await expect(SkyLinkContract.connect(addr2).tryMRO()).to.be.reverted;
        await SkyLinkContract.addMRO(addr2, "MRO");
        await expect(SkyLinkContract.connect(addr2).tryMRO()).to.not.be
            .reverted;
    });
    it("Should test whether alsoThirdParty modifier is working as expected", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 } =
            await loadFixture(deploySkyLink);
        await expect(SkyLinkContract.connect(addr2).tryThirdParty()).to.be
            .reverted;
        await SkyLinkContract.addThirdParty(addr2);
        await expect(SkyLinkContract.connect(addr2).tryThirdParty()).to.not.be
            .reverted;
    });
    it("Should test whether alsoManufacturer modifier is working as expected", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 } =
            await loadFixture(deploySkyLink);
        await expect(SkyLinkContract.connect(addr2).tryManufacturer()).to.be
            .reverted;
        await SkyLinkContract.addManufacturer(addr2);
        await expect(SkyLinkContract.connect(addr2).tryManufacturer()).to.not.be
            .reverted;
    });
});
