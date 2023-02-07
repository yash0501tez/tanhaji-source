import smartpy as sp

class Unpack(sp.Contract):
    def __init__(self):
        self.init(address=sp.address("tz1Rqm76xELsDa7fpjeX8gfAt4imV2fVMmhn"))

    @sp.entry_point
    def unpack_data(self, data_bytes):
        sp.set_type(data_bytes, sp.TBytes)
        data = sp.unpack(
            data_bytes,
            sp.TPair(sp.TPair(sp.TAddress,sp.TNat),sp.TNat)
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
    unpack = Unpack()
    scenario += unpack
    scenario += unpack.unpack_data(
        sp.bytes("0x05070707070a000000160000fadcd216de7817afb85f7f7a39510e2ed224303200a4010000")
    )
    