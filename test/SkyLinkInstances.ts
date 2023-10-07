import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SkyLink Contract Testing / SkyLink API Contract Testing", () => {
    async function deploySkyLink() {
        const SkyLink = await ethers.getContractFactory("SkyLink");
        const SkyLinkContract = await SkyLink.deploy(1, 1, 1);
        const [owner, addr1, addr2, addr3, addr4, addr5] =
            await ethers.getSigners();
        await SkyLinkContract.waitForDeployment();
        return { SkyLinkContract, owner, addr1, addr2, addr3, addr4, addr5 };
    }
    it("Should create AirCraft instance + Fetch all its attributes correctly", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await expect(
            SkyLinkContract.addAirCraft(
                "XYZ123",
                "Boeing",
                "737MAX",
                169999999,
                400,
                owner.address,
                { value: ethers.parseEther("1.2334") }
            )
        ).to.not.be.reverted;
        expect(await SkyLinkContract.getAirCraftStatus("XYZ123")).to.equal(
            false
        );
        expect(await SkyLinkContract.getAirCraftInfo("XYZ123")).to.deep.equal([
            "Boeing",
            "737MAX",
            "169999999",
            "400",
        ]);
        expect(
            await SkyLinkContract.getAirCraftCurrentOwner("XYZ123")
        ).to.equal(owner.address);
        /*expect(
            await SkyLinkContract.getActiveAirCraftComponents("XYZ123")
        ).to.deep.equal([
            ["Component1", "X1"],
            ["Component2", "X2"],
            ["Component3", "X3"],
        ]);*/
    });
    it("Should NOT allow an AirCraft instance to spawn when it has <4 components", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await SkyLinkContract.addAirCraft(
            "XYZ123",
            "Boeing",
            "737MAX",
            169999999,
            400,
            owner.address,
            { value: ethers.parseEther("1.2334") }
        );
        await expect(
            SkyLinkContract.spawnAirCraft("XYZ123", {
                value: ethers.parseEther("1"),
            })
        ).to.be.reverted;
        expect(await SkyLinkContract.getAirCraftStatus("XYZ123")).to.equal(
            false
        );
    });
    it("Should ground an AirCraft instance", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await SkyLinkContract.addAirCraft(
            "XYZ123",
            "Boeing",
            "737MAX",
            169999999,
            400,
            owner.address,
            { value: ethers.parseEther("1.2334") }
        );
        await expect(
            SkyLinkContract.haltAirCraft("XYZ123", {
                value: ethers.parseEther("1"),
            })
        ).to.not.be.reverted;
        expect(await SkyLinkContract.getAirCraftStatus("XYZ123")).to.equal(
            false
        );
    });
    it("Should add non-duplicated AirComponents and fetch them correctly", async () => {
        const { SkyLinkContract, owner, addr2 } = await loadFixture(
            deploySkyLink
        );
        await SkyLinkContract.addAirCraft(
            "XYZ123",
            "Boeing",
            "737MAX",
            169999999,
            400,
            owner.address,
            { value: ethers.parseEther("1.2334") }
        );
        await expect(
            SkyLinkContract.addAirComponent(
                "XYZ123",
                "Engine",
                "ND99",
                "SomeOne",
                1837,
                { value: ethers.parseEther("1.2334") }
            )
        ).to.not.be.reverted;
        await expect(
            SkyLinkContract.addAirComponent(
                "XYZ123",
                "Engine",
                "ND99",
                "SomeOne",
                1837,
                { value: ethers.parseEther("1.2334") }
            )
        ).to.be.reverted;
        await expect(
            SkyLinkContract.connect(addr2).addAirComponent(
                "XYZ123",
                "Engine",
                "ND99",
                "SomeOne",
                1837,
                { value: ethers.parseEther("1.2334") }
            )
        ).to.be.reverted;
        expect(
            await SkyLinkContract.getActiveAirCraftComponents("XYZ123")
        ).to.deep.equal([["ND99", "Engine", "SomeOne", "1837", true]]);
    });
    it("Should add AirComponent and halt it correctly", async () => {
        const { SkyLinkContract, owner, addr2 } = await loadFixture(
            deploySkyLink
        );
        await SkyLinkContract.addAirCraft(
            "XYZ123",
            "Boeing",
            "737MAX",
            169999999,
            400,
            owner.address,
            { value: ethers.parseEther("1.2334") }
        );
        await SkyLinkContract.addAirComponent(
            "XYZ123",
            "Engine",
            "ND99",
            "SomeOne",
            1837,
            { value: ethers.parseEther("1.2334") }
        );
        await SkyLinkContract.addAirComponent(
            "XYZ123",
            "Engine",
            "ND999",
            "SomeOne",
            1837,
            { value: ethers.parseEther("1.2334") }
        );
        await expect(
            SkyLinkContract.connect(addr2).haltAirComponent("ND99", "XYZ123", {
                value: ethers.parseEther("1.2334"),
            })
        ).to.be.reverted;
        await expect(
            SkyLinkContract.haltAirComponent("ND99", "XYZ123", {
                value: ethers.parseEther("1.2334"),
            })
        ).to.not.be.reverted;
        expect(
            await SkyLinkContract.getHaltedAirCraftComponents("XYZ123")
        ).to.deep.equal([["ND99", "Engine", "SomeOne", "1837", false]]);
        expect(
            await SkyLinkContract.getActiveAirCraftComponents("XYZ123")
        ).to.deep.equal([
            ["", "", "", 0n, false],
            ["ND999", "Engine", "SomeOne", "1837", true],
        ]);
    });
    it("Should spawn an AirCraft instance if it has >3 components", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await SkyLinkContract.addAirCraft(
            "XYZ123",
            "Boeing",
            "737MAX",
            169999999,
            400,
            owner.address,
            { value: ethers.parseEther("1.2334") }
        );
        await SkyLinkContract.addAirComponent(
            "XYZ123",
            "Engine",
            "ND99",
            "SomeOne",
            1837,
            { value: ethers.parseEther("1.2334") }
        );
        await SkyLinkContract.addAirComponent(
            "XYZ123",
            "Engine",
            "ND993",
            "SomeOne",
            1837,
            { value: ethers.parseEther("1.2334") }
        );
        await SkyLinkContract.addAirComponent(
            "XYZ123",
            "Engine",
            "ND9945",
            "SomeOne",
            1837,
            { value: ethers.parseEther("1.2334") }
        );
        await SkyLinkContract.addAirComponent(
            "XYZ123",
            "Engine",
            "ND399",
            "SomeOne",
            1837,
            { value: ethers.parseEther("1.2334") }
        );

        await expect(
            SkyLinkContract.spawnAirCraft("XYZ123", {
                value: ethers.parseEther("1"),
            })
        ).to.not.be.reverted;
        expect(await SkyLinkContract.getAirCraftStatus("XYZ123")).to.equal(
            true
        );
    });
    it("Should exchange AirCraft correctly", async () => {
        const { SkyLinkContract, owner, addr2 } = await loadFixture(
            deploySkyLink
        );
        await SkyLinkContract.addAirCraft(
            "XYZ123",
            "Boeing",
            "737MAX",
            169999999,
            400,
            owner.address,
            { value: ethers.parseEther("1.2334") }
        );
        await expect(
            SkyLinkContract.exchangeAirCraft("XYZ123", addr2, {
                value: ethers.parseEther("1"),
            })
        ).to.not.be.reverted;
        expect(
            await SkyLinkContract.getAirCraftCurrentOwner("XYZ123")
        ).to.equal(addr2.address);
        expect(
            await SkyLinkContract.getAirCraftPrevOwners("XYZ123")
        ).to.deep.equal([owner.address]);
    });
    it("Should NOT exchange AirCraft (Not Owner)", async () => {
        const { SkyLinkContract, owner, addr2 } = await loadFixture(
            deploySkyLink
        );
        await SkyLinkContract.addAirCraft(
            "XYZ123",
            "Boeing",
            "737MAX",
            169999999,
            400,
            owner.address,
            { value: ethers.parseEther("1.2334") }
        );
        await expect(
            SkyLinkContract.connect(addr2).exchangeAirCraft("XYZ123", addr2, {
                value: ethers.parseEther("1"),
            })
        ).to.be.reverted;
    });
    it("Should log service records for an AirCraft instance + Fetch them", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await expect(
            SkyLinkContract.addAirCraft(
                "XYZ123",
                "Boeing",
                "737MAX",
                169999999,
                400,
                owner.address,
                { value: ethers.parseEther("1.2334") }
            )
        ).to.not.be.reverted;
        await expect(
            SkyLinkContract.logServiceRecord(
                "XYZ123",
                owner.address,
                1696546827,
                "Service1 Success!",
                "xxxxx",
                ["ABC", "DEF"],
                { value: ethers.parseEther("1") }
            )
        );
        await SkyLinkContract.logServiceRecord(
            "XYZ123",
            owner.address,
            1696546827,
            "Service2 Success!",
            "xxxxx2",
            ["ABC", "DEF"],
            { value: ethers.parseEther("1") }
        );
        expect(
            await SkyLinkContract.getServiceRecords("XYZ123")
        ).to.not.deep.equal([
            [
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                1696546827n,
                "Service1 Success!",
                "xxxxx",
                ["ABC", "DEF"],
            ],
            [
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                1696546828n,
                "Service2 Success!",
                "xxxxx2",
                ["ABC", "DEF"],
            ],
        ]);
    });
    it("Should assign flight number to AirCraft instance", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        await expect(
            SkyLinkContract.addAirCraft(
                "XYZ123",
                "Boeing",
                "737MAX",
                169999999,
                400,
                owner.address,
                { value: ethers.parseEther("1.2334") }
            )
        ).to.not.be.reverted;
        await expect(SkyLinkContract.assignFlight("FLIGHT23", "XYZ123")).to.not
            .be.reverted;
    });
    it("Should compare strings correctly", async () => {
        const { SkyLinkContract, owner } = await loadFixture(deploySkyLink);
        expect(
            await SkyLinkContract.compareStrings("hello", "hello")
        ).to.be.equal(true);
        expect(
            await SkyLinkContract.compareStrings("hello", "helloo")
        ).to.be.equal(false);
        expect(
            await SkyLinkContract.compareStrings("helloo", "hello")
        ).to.be.equal(false);
    });
});
