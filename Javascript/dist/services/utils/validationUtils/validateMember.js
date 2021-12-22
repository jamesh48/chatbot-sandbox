"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMember = void 0;
const validateMember = (theGuild, receivedAuthorId) => {
    let validatedMember;
    theGuild.members.cache.forEach((member) => {
        if (member.user.id === receivedAuthorId) {
            validatedMember = member;
        }
    });
    if (!validatedMember) {
        throw new Error("You are not part of the guild");
    }
    else {
        return validatedMember;
    }
};
exports.validateMember = validateMember;
//# sourceMappingURL=validateMember.js.map