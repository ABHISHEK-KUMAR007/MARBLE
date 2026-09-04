package com.marblestore.marble_store_backend.Model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class AdminStatusTest {

    @Test
    void legacyInvitationPendingStatusIsSupported() {
        assertEquals(AdminStatus.INVITATION_PENDING, AdminStatus.valueOf("INVITATION_PENDING"));
    }
}
