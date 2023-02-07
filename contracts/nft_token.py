import smartpy as sp

class Unpack(sp.Contract):
    def __init__(self):
        self.init(address=sp.address("tz1Rqm76xELsDa7fpjeX8gfAt4imV2fVMmhn"))

    @sp.entry_point
    def unpack_data(self, data_bytes):
        sp.set_type(data_bytes, sp.TBytes)
        data = sp.unpack(
            data_bytes,
            sp.TPair(sp.TPair(sp.TAddress,sp.TNat),sp.TBytes)
        ).open_some("Invalid data_bytes")

        sp.trace(data)

        address = sp.fst(sp.fst(data))
        amount = sp.snd(sp.fst(data))
        token_id= sp.snd(data)
        
        # sp.unpack(data_bytes, sp.TPair(sp.TPair(sp.TAddress, sp.TNat), sp.TNat))
        self.data.address = address

@sp.add_test(name="Unpack")
def test():
    scenario = sp.test_scenario()
    alice = sp.test_account("alice")
    unpack = Unpack()
    scenario += unpack
    scenario += unpack.unpack_data(sp.bytes("0x05070707070a000000160000fadcd216de7817afb85f7f7a39510e2ed224303200000100000084363937303636373333613266326636323631363636623732363536393631373436623666376136333734363336323736363233373761363336363635363836633337373936343732363433333735363336343637333433373732333636333665373037333761363536633761373536383731373037353663363333323761366336373731")).run(sender=alice)