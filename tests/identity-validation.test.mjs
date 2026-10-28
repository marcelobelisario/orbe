import assert from "node:assert/strict";
import test from "node:test";
import {
    getPasswordStrength,
    isValidEmail,
    validateLogin,
    validateRegistration,
} from "../src/modules/identity/validation.ts";

const valid = {
    fullName: "Ana Silva",
    email: "ana@example.com",
    password: "Senha123!",
    confirmPassword: "Senha123!",
    termsAccepted: true,
};

test("login valida e-mail e o mesmo mínimo de senha do cadastro", () => {
    assert.deepEqual(validateLogin(" ana@example.com ", "Senha123!"), {});
    assert.ok(validateLogin("a@", "Senha123!").email);
    assert.ok(validateLogin("ana@example.com", "1234567").password);
});

test("cadastro exige nome completo, e-mail válido e aceite explícito", () => {
    assert.deepEqual(validateRegistration(valid), {});
    const errors = validateRegistration({
        ...valid,
        fullName: "Ana",
        email: "a@",
        termsAccepted: false,
    });
    assert.deepEqual(Object.keys(errors).sort(), ["email", "fullName", "termsAccepted"]);
    assert.equal(isValidEmail(" ana@example.com "), true);
});

test("cadastro e indicador usam o mesmo mínimo de oito caracteres", () => {
    for (const password of ["", "Ab123!", "Ab1234!"]) {
        assert.ok(validateRegistration({...valid, password, confirmPassword: password}).password);
        assert.equal(getPasswordStrength(password), 0);
    }
    assert.deepEqual(
        validateRegistration({...valid, password: "abcdefgh", confirmPassword: "abcdefgh"}),
        {},
    );
    assert.equal(getPasswordStrength("abcdefgh"), 1);
    assert.equal(getPasswordStrength("Abcdefg1"), 2);
    assert.equal(getPasswordStrength("Abcdef1!"), 3);
});

test("confirmação vazia ou diferente impede o cadastro", () => {
    assert.ok(validateRegistration({...valid, confirmPassword: ""}).confirmPassword);
    assert.ok(validateRegistration({...valid, confirmPassword: "outra senha"}).confirmPassword);
});
