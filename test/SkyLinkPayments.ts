import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SkyLink Payments Contract Testing", () => {
    async function deploySkyLink() {
        const SkyLink = await ethers.getContractFactory("SkyLink");
        const SkyLinkContract = await SkyLink.deploy(
            1200000000000000000n,
            2,
            99
        );
        const [owner, addr1, addr2, addr3, addr4, addr5] =
            await ethers.getSigners();
        await SkyLinkContract.waitForDeployment();
        return { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 };
    }

    it("Should correctly get fees based on FeeClass", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        expect(await SkyLinkContract.getFee(0)).to.equal(1200000000000000000n);
        expect(await SkyLinkContract.getFee(1)).to.equal(2);
        expect(await SkyLinkContract.getFee(2)).to.equal(99);
    });
    it("Should refuse payment (msg.value too low)", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await expect(
            SkyLinkContract.deposit({
                value: ethers.parseEther("0.3"),
            })
        ).to.be.reverted;
    });
    it("Should force payment and deposit money to contract successfully", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await SkyLinkContract.deposit({
            value: ethers.parseEther("1.2334"),
        });
        expect(await SkyLinkContract.getContractBalance()).to.equal(
            1233400000000000000n
        );
    });
    it("Should withdraw balance to msg.sender", async () => {
        const { SkyLinkContract, owner, addr1 } = await loadFixture(
            deploySkyLink
        );
        await SkyLinkContract.addSkyLink(addr1);
        await SkyLinkContract.deposit({
            value: ethers.parseEther("1.2334"),
        });
        await expect(SkyLinkContract.connect(addr1).withdraw()).to.not.be
            .reverted;
        expect(await SkyLinkContract.getContractBalance()).to.equal(0);
        expect(
            (await ethers.provider.getBalance(addr1.address)) -
                10000000000000000000000n
        ).to.be.greaterThan(1000);
    });
    it("Should NOT withdraw balance to msg.sender if not SUPER role", async () => {
        const { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 } =
            await loadFixture(deploySkyLink);
        await SkyLinkContract.addManufacturer(addr2);
        await SkyLinkContract.addMRO(addr3, "MRO");
        await SkyLinkContract.addThirdParty(addr4);
        await SkyLinkContract.addSkyLink(addr5);
        await SkyLinkContract.deposit({
            value: ethers.parseEther("1.2334"),
        });
        await expect(SkyLinkContract.connect(addr1).withdraw()).to.be.reverted;
        await expect(SkyLinkContract.connect(addr2).withdraw()).to.be.reverted;
        await expect(SkyLinkContract.connect(addr3).withdraw()).to.be.reverted;
        await expect(SkyLinkContract.connect(addr4).withdraw()).to.be.reverted;
        await expect(SkyLinkContract.connect(addr5).withdraw()).to.not.be
            .reverted;
    });
});
