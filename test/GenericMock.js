const { functionSelector } = require("../util/functionSelector")

const GenericMock = artifacts.require("GenericMock")
const Test = artifacts.require("Test")

contract("GenericMock", accounts => {
    let mock
    let test

    beforeEach(async () => {
        mock = await GenericMock.new()
        test = await Test.new(mock.address)
    })

    it("should return mock uint256 values", async () => {
        const fooFunc = functionSelector("foo()")

        await mock.setMockValue(fooFunc, 5)
        await test.getUint256Value()
        assert.equal(await test.uint256Value.call(), 5, "mock value incorrect")

        await mock.setMockValue(fooFunc, 8)
        await test.getUint256Value()
        assert.equal(await test.uint256Value.call(), 8, "mock value incorrect")
    })

    it("should return mock bytes32 values", async () => {
        const barFunc = functionSelector("bar()")
        const h1 = web3.sha3("hello")
        const h2 = web3.sha3("world")

        await mock.setMockValue(barFunc, h1)
        await test.getBytes32Value()
        assert.equal(await test.bytes32Value.call(), h1, "mock bytes32 value incorrect")

        await mock.setMockValue(barFunc, h2)
        await test.getBytes32Value()
        assert.equal(await test.bytes32Value.call(), h2, "mock bytes32 value incorrect")
    })

    it("should execute a permissioned function", async () => {
        const protectedFunc = functionSelector("protectedFunc()")
        await mock.execute(test.address, protectedFunc)
        assert.equal(await test.protectedValue.call(), 5, "protected value not set by protected function")
    })
})
