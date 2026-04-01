"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  contributorRegistrationSchema,
  enterpriseRegistrationSchema,
} from "@/lib/validations/registration";

export type ActionResult = { success: true } | { success: false; error: string };

// ── Contributor Registration ──
export async function registerContributor(data: unknown): Promise<ActionResult> {
  const parsed = contributorRegistrationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const v = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email: v.email.toLowerCase() },
  });
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(v.password, 10);

  await prisma.user.create({
    data: {
      email:         v.email.toLowerCase(),
      passwordHash,
      firstName:     v.firstName,
      lastName:      v.lastName,
      role:          "contributor",
      phone:         v.phone ?? null,
      phoneVerified: true,
      emailVerified: true,
      contributorProfile: {
        create: {
          contribType:        v.contribType,
          country:            v.country,
          dob:                new Date(v.dob),
          timezone:           v.timezone,
          departmentCategory: v.departmentCategory,
          departmentOther:    v.departmentOther ?? null,
          primarySkills:      v.primarySkills,
          secondarySkills:    v.secondarySkills,
          otherSkills:        v.otherSkills,
          availability:       v.availability,
          degree:             v.degree ?? null,
          branch:             v.branch ?? null,
          linkedin:           v.linkedin ?? null,
          careerStage:        v.careerStage ?? null,
          yearsExperience:    v.yearsExperience ?? null,
          workStart:          v.workStart ?? null,
          workEnd:            v.workEnd ?? null,
          ndaAccepted:        true,
          ndaSignature:       v.ndaSignature,
          acceptTos:          true,
          acceptCoc:          true,
          acceptPrivacy:      true,
          acceptFee:          true,
          acceptAhp:          true,
          marketingOptIn:     v.marketingOptIn,
        },
      },
    },
  });

  return { success: true };
}

// ── SSO Contributor Onboarding (existing user, no password) ──
export async function onboardContributor(data: {
  firstName: string;
  lastName?: string;
  email: string;
  contribType: string;
  country: string;
  dob: string;
  timezone: string;
  departmentCategory: string;
  departmentOther?: string;
  primarySkills: string[];
  secondarySkills: string[];
  otherSkills: string[];
  availability: string;
  degree?: string;
  branch?: string;
  linkedin?: string;
  careerStage?: string;
  yearsExperience?: string;
  workStart?: string;
  workEnd?: string;
  phone?: string;
  ndaAccepted: boolean;
  ndaSignature?: string;
  acceptTos: boolean;
  acceptCoc: boolean;
  acceptPrivacy: boolean;
  acceptFee: boolean;
  acceptAhp: boolean;
  marketingOptIn: boolean;
}): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: "No account found for this email" };
    }

    await prisma.user.update({
      where: { email: data.email.toLowerCase() },
      data: {
        firstName: data.firstName,
        lastName:  data.lastName ?? "",
        role:      "contributor",
        phone:     data.phone ?? null,
        contributorProfile: {
          create: {
            contribType:        data.contribType,
            country:            data.country,
            dob:                new Date(data.dob),
            timezone:           data.timezone,
            departmentCategory: data.departmentCategory,
            departmentOther:    data.departmentOther ?? null,
            primarySkills:      data.primarySkills,
            secondarySkills:    data.secondarySkills,
            otherSkills:        data.otherSkills,
            availability:       data.availability,
            degree:             data.degree ?? null,
            branch:             data.branch ?? null,
            linkedin:           data.linkedin ?? null,
            careerStage:        data.careerStage ?? null,
            yearsExperience:    data.yearsExperience ?? null,
            workStart:          data.workStart ?? null,
            workEnd:            data.workEnd ?? null,
            ndaAccepted:        data.ndaAccepted,
            ndaSignature:       data.ndaSignature ?? "",
            acceptTos:          true,
            acceptCoc:          true,
            acceptPrivacy:      true,
            acceptFee:          true,
            acceptAhp:          true,
            marketingOptIn:     data.marketingOptIn,
          },
        },
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to complete onboarding. Please try again." };
  }
}

// ── Enterprise Registration ──
export async function registerEnterprise(data: unknown): Promise<ActionResult> {
  const parsed = enterpriseRegistrationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const v = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email: v.adminEmail.toLowerCase() },
  });
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(v.password, 10);

  await prisma.user.create({
    data: {
      email:         v.adminEmail.toLowerCase(),
      passwordHash,
      firstName:     v.adminFirstName,
      lastName:      v.adminLastName,
      role:          "enterprise",
      phone:         v.phone ?? null,
      phoneVerified: true,
      emailVerified: true,
      enterpriseProfile: {
        create: {
          orgName:              v.orgName,
          orgType:              v.orgType,
          orgTypeOther:         v.orgTypeOther ?? null,
          industry:             v.industry,
          industryOther:        v.industryOther ?? null,
          companySize:          v.companySize,
          website:              v.website ?? null,
          hqCountry:            v.hqCountry ?? null,
          hqCity:               v.hqCity ?? null,
          adminTitle:           v.adminTitle,
          adminDept:            v.adminDept ?? null,
          incorporationCountry: v.incorporationCountry ?? null,
          acceptTos:            true,
          acceptPp:             true,
          acceptEsa:            true,
          acceptAhp:            true,
          marketingOptIn:       v.marketingOptIn,
        },
      },
    },
  });

  return { success: true };
}
