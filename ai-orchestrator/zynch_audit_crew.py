import os
from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv

load_dotenv()

# Configuracion del LLM (Gemini para Zynch)
gemini_llm = LLM(
    model="gemini/gemini-flash-latest",
    api_key=os.getenv("GOOGLE_API_KEY")
)

# Agent 1: SaaS Architecture Auditor
# Purpose: Ensures that the Zynch engine remains "Camaleonic" and multi-tenant safe.
architect = Agent(
  role='SaaS Architecture Auditor',
  goal='Analyze the backend modules to ensure total data isolation between tenants.',
  backstory="""You are a veteran software architect specializing in White-Label SaaS platforms. 
  You ensure that all queries and mutations are filtered by `tenantId` and that the schema supports scalability.""",
  verbose=True,
  allow_delegation=False,
  llm=gemini_llm
)

# Agent 2: Security & Compliance Officer
# Purpose: Audits the permissions and authentication flow.
security_officer = Agent(
  role='Security & Compliance Officer',
  goal='Verify that all backend functions have proper authorization checks and prevent cross-tenant data access.',
  backstory="""You are an expert in cybersecurity for cloud platforms. 
  Your mission is to ensure that a user from Tenant A can NEVER access or modify the data of Tenant B.""",
  verbose=True,
  allow_delegation=False,
  llm=gemini_llm
)

# Define the Audit Task
audit_task = Task(
  description="""Review the following files in `convex/`:
  - `users.ts`: Check that `login`, `register`, and `createAdminUser` handle `tenantId` correctly.
  - `appointments.ts`: Verify that all queries and mutations filter by `tenantId`.
  - `gallery.ts`: Ensure photos are isolated per tenant.
  - `orders.ts` & `products.ts`: Confirm catalog and transaction isolation.
  - `crm.ts`: Validate that client management is strictly per-tenant.
  
  Identify any function that lacks a `tenantId` check or and index-based filter.""",
  agent=architect,
  expected_output='A compliance report listing all audited functions and highlighting any security gaps or missing filters.'
)

# Instantiate the Crew
zynch_crew = Crew(
  agents=[architect, security_officer],
  tasks=[audit_task],
  process=Process.sequential
)

if __name__ == "__main__":
    print("Iniciando Auditoria de Seguridad Zynch...")
    result = zynch_crew.kickoff()
    
    # Guardar reporte en archivo para evitar errores de codificación en consola
    report_path = os.path.join(os.path.dirname(__file__), "audit_report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# Reporte de Auditoría de Seguridad Zynch\n\n")
        f.write(str(result))
    
    print(f"\n✅ Auditoría completa. Reporte guardado en: {report_path}")
