import socketio
import asyncio
import time

sio = socketio.AsyncClient()

async def send_burst():
    await sio.connect('http://localhost:8000')
    print("Connected for stress test.")
    
    agents = ["MonitoringAgent", "ContextAgent", "RCAAgent", "RemediationAgent", "ExecutionAgent"]
    
    for i in range(100):
        agent = agents[i % len(agents)]
        await sio.emit('agent_thought', {
            "agent": agent,
            "content": f"STRESS TEST EVENT #{i}: Validating high-frequency telemetry throughput and rendering stability.",
            "timestamp": time.time()
        })
        # No sleep to maximize throughput
        if i % 10 == 0:
            print(f"Sent {i} events...")
    
    print("Burst complete. Waiting for sync...")
    await asyncio.sleep(2)
    await sio.disconnect()

if __name__ == "__main__":
    asyncio.run(send_burst())
